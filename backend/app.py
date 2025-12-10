# backend/app.py

import os
import math
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
import google.generativeai as genai
from datetime import datetime
import uuid
from auth import auth
from customer_routes import customer_routes
from quotation_routes import quotation_routes
from admin_routes import admin_routes

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MONGO_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("MONGODB_DB")
COLLECTION = os.getenv("MONGODB_PRODUCTS_COLLECTION")

genai.configure(api_key=GEMINI_API_KEY)

VISION = genai.GenerativeModel("models/gemini-2.5-flash")
EMBED_MODEL = "models/text-embedding-004"

mongo = MongoClient(MONGO_URI)
db = mongo[DB_NAME]
products = db[COLLECTION]

app = Flask(__name__)
CORS(app)

# REGISTER BLUEPRINTS
app.register_blueprint(auth, url_prefix="/auth")
app.register_blueprint(customer_routes, url_prefix="/customer")
app.register_blueprint(quotation_routes, url_prefix="/quotation")
app.register_blueprint(admin_routes, url_prefix="/admin")



# ---------------- EMBEDDING UTILS ---------------- #

def get_embedding(text):
    res = genai.embed_content(model=EMBED_MODEL, content=text)
    return res["embedding"]


def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    na = math.sqrt(sum(x * x for x in a))
    nb = math.sqrt(sum(x * x for x in b))
    return dot / (na * nb + 1e-9)


def ensure_embedding(prod):
    """Generate and store embedding once."""
    if "embedding" in prod:
        return prod["embedding"]

    combined = " ".join([
        prod.get("product", ""),
        prod.get("shortText", ""),
        prod.get("description", ""),
        prod.get("productGroup", ""),
        " ".join(prod.get("tags", []))
    ])

    emb = get_embedding(combined)
    products.update_one({"_id": prod["_id"]}, {"$set": {"embedding": emb}})
    return emb


# ---------------- GEMINI PROMPT ---------------- #

prompt = """
You are an interior furniture detection assistant.

Your job:
- Identify ONLY major furniture items visible in the image.
- Required categories: chairs, desks, shelves, organisers, plants.
- Do NOT include shelves unless they are clearly standalone units.
- Do NOT guess or hallucinate items.
- If unsure, skip the item.
- Group identical items, return total quantity.

Return ONLY JSON like this:
[
  { "item_name": "black office chair", "quantity": 2 },
  { "item_name": "wooden executive desk", "quantity": 1 }
]
"""


# ---------------- QUOTATION MODULE ---------------- #

def merge_identical_items(items):
    merged = {}
    
    for item in items:
        key = item.get("productId") or item.get("itemNo") or item["product"]

        if key not in merged:
            merged[key] = item.copy()
        else:
            merged[key]["quantity"] += item["quantity"]
            merged[key]["line_total"] += item["line_total"]

    return list(merged.values())

def generate_quotation(detected_items, customer_name="Walk-in Client", tax_rate=0.18, discount_rate=0.0):
    quotation_id = f"QT-{uuid.uuid4().hex[:8].upper()}"
    date_str = datetime.now().strftime("%Y-%m-%d")

    # Transform items to include all product details
    formatted_items = []
    for item in detected_items:
        formatted_items.append({
            "itemNo": item.get("itemNo", "N/A"),
            "product": item["product"],
            "productId": item.get("productId", "N/A"),
            "productGroup": item.get("productGroup", "N/A"),
            "quantity": item["quantity"],
            "unit_price": item["unit_price"],
            "supplier": item.get("supplier", "N/A"),
            "store": item.get("store", "N/A"),
            "line_total": item["line_total"],
            "match_confidence": item.get("match_confidence", 0)
        })

    subtotal = sum(item["line_total"] for item in formatted_items)
    tax_amount = subtotal * tax_rate
    discount_amount = subtotal * discount_rate
    grand_total = subtotal + tax_amount - discount_amount

    return {
        "quotationId": quotation_id,
        "date": date_str,
        "customerName": customer_name,
        "validity": "7 days",
        "items": formatted_items,
        "pricing": {
            "subtotal": round(subtotal, 2),
            "taxRate": tax_rate,
            "taxAmount": round(tax_amount, 2),
            "discountRate": discount_rate,
            "discountAmount": round(discount_amount, 2),
            "grandTotal": round(grand_total, 2)
        },
        "terms": [
            "Quotation valid for 7 days.",
            "Delivery charges may apply.",
            "All items include standard manufacturer warranty."
        ]
    }


# ---------------- API ROUTES ---------------- #

@app.route("/health", methods=["GET"])
def health():
    return {"status": "ok"}


@app.route("/analyze-image", methods=["POST"])
def analyze_image():
    if "file" not in request.files:
        return jsonify({"error": "No file"}), 400

    file = request.files["file"]
    bytes_data = file.read()

    # ---- STEP 1: GEMINI DETECTION ---- #
    response = VISION.generate_content([
        prompt,
        {"mime_type": "image/jpeg", "data": bytes_data}
    ])

    text = response.text.strip()

    try:
        start = text.index("[")
        end = text.rindex("]") + 1
        detected_raw = json.loads(text[start:end])
    except:
        return jsonify({"error": "Gemini JSON parsing failed", "raw": text}), 500
    

    print("RAW GEMINI OUTPUT:")
    print(text)

    # ---- STEP 2: MATCH TO INVENTORY ---- #

    matched_items = []

    for det in detected_raw:
        search_text = det["item_name"] + " " + det.get("attributes", "")
        emb = get_embedding(search_text)

        best = None
        best_score = -1

        for prod in products.find({}):
            p_emb = ensure_embedding(prod)
            score = cosine(emb, p_emb)
            if score > best_score:
                best_score = score
                best = prod

        # Skip low confidence matches (<0.55)
        if not best or best_score < 0.50:
            continue

        qty = det["quantity"]
        price = best["price"]
        line_total = qty * price

        matched_items.append({
            "itemNo": best.get("itemNo", "N/A"),
            "product": best["product"],
            "productId": best.get("productId", "N/A"),
            "productGroup": best.get("productGroup", "N/A"),
            "quantity": qty,
            "unit_price": price,
            "supplier": best.get("supplier", "N/A"),
            "store": best.get("store", "N/A"),
            "line_total": line_total,
            "match_confidence": round(best_score, 3)
        })

        # ---- DEDUPLICATE IDENTICAL PRODUCTS ---- #
        grouped = {}

        for item in matched_items:
            key = item["productId"]   # or itemNo
            
            if key not in grouped:
                grouped[key] = item
            else:
                grouped[key]["quantity"] += item["quantity"]
                grouped[key]["line_total"] += item["line_total"]

        matched_items = list(grouped.values())


    # ---- STEP 3: GENERATE QUOTATION ---- #

    # merge identical items first
    merged_items = merge_identical_items(matched_items)

    quotation = generate_quotation(merged_items)

    return jsonify(quotation)


if __name__ == "__main__":
    app.run(port=5000, debug=True)