# backend/quotation_routes.py

from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
import datetime, os
from dotenv import load_dotenv
from auth import validate_session

load_dotenv()

mongo = MongoClient(os.getenv("MONGODB_URI"))
db = mongo[os.getenv("MONGODB_DB")]
quotations = db["quotations"]
customers = db["customers"]

quotation_routes = Blueprint("quotations", __name__)


# ---------------------------------------------------
# SAVE QUOTATION  (Sales Executive Only)
# ---------------------------------------------------
@quotation_routes.route("/save", methods=["POST"])
def save_quotation():
    session = validate_session(request)
    if not session or session["role"] != "sales":
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json

    if "customerId" not in data:
        return jsonify({"error": "customerId required"}), 400

    # Build quotation payload
    quotation = {
        "quotationId": data["quotationId"],
        "customerId": data["customerId"],
        "salesExecutiveId": session["userId"],  # This now stores actual user ID
        "date": data["date"],
        "items": data["items"],
        "pricing": data["pricing"],
        "terms": data["terms"],
        "status": "pending",
        "createdAt": datetime.datetime.utcnow()
    }

    inserted = quotations.insert_one(quotation)
    qid = inserted.inserted_id

    customers.update_one(
        {"_id": ObjectId(data["customerId"])},
        {"$push": {"quotations": str(qid)}}
    )

    return jsonify({"msg": "Quotation saved", "id": str(qid)})


# ---------------------------------------------------
# VIEW QUOTATION BY ID
# ---------------------------------------------------
@quotation_routes.route("/view/<qid>", methods=["GET"])
def view_quotation(qid):
    q = quotations.find_one({"_id": ObjectId(qid)})
    if not q:
        return jsonify({"error": "not found"}), 404

    q["_id"] = str(q["_id"])
    return jsonify(q)

# ---------------------------------------------------
# GET QUOTATIONS FOR A CUSTOMER
# ---------------------------------------------------
@quotation_routes.route("/customer/<customer_id>", methods=["GET"])
def get_customer_quotations(customer_id):
    session = validate_session(request)
    if not session:
        return jsonify({"error": "Unauthorized"}), 403
    
    # Find all quotations for this customer
    customer_quotations = list(quotations.find({"customerId": customer_id}))
    
    for q in customer_quotations:
        q["_id"] = str(q["_id"])
    
    return jsonify(customer_quotations)

@quotation_routes.route("/sales/<sales_id>", methods=["GET"])
def get_sales_quotations(sales_id):
    session = validate_session(request)
    if not session or session["role"] != "sales":
        return jsonify({"error": "Unauthorized"}), 403

    results = list(quotations.find({"salesExecutiveId": sales_id}))

    for q in results:
        q["_id"] = str(q["_id"])

    return jsonify(results)