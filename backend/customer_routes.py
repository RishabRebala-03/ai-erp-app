# backend/customer_routes.py

from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
import os, datetime
from dotenv import load_dotenv
from auth import validate_session   # <-- REQUIRED FIX

load_dotenv()

mongo = MongoClient(os.getenv("MONGODB_URI"))
db = mongo[os.getenv("MONGODB_DB")]
customers = db["customers"]

customer_routes = Blueprint("customers", __name__)

# ---------------- CREATE CUSTOMER ---------------- #

@customer_routes.route("/create", methods=["POST"])
def create_customer():
    session = validate_session(request)
    if not session or session["role"] != "sales":
        return jsonify({"error": "Unauthorized"}), 403

    sales_exec_id = session["userId"]  # This is now the actual user ID

    data = request.json

    doc = {
        "name": data["name"],
        "email": data.get("email", ""),
        "phone": data.get("phone", ""),
        "address": data.get("address", ""),
        "salesExecutiveId": sales_exec_id,  # Store actual user ID, not session ID
        "quotations": [],
        "createdAt": datetime.datetime.utcnow()
    }

    cid = customers.insert_one(doc).inserted_id
    return jsonify({"msg": "Customer created", "id": str(cid)})


# ---------------- LIST CUSTOMERS FOR SPECIFIC SALES EXECUTIVE ---------------- #

@customer_routes.route("/sales/<sales_id>", methods=["GET"])
def list_customers_for_sales(sales_id):
    docs = list(customers.find({"salesExecutiveId": sales_id}))
    for d in docs:
        d["_id"] = str(d["_id"])
    return jsonify(docs)


# ---------------- LIST ALL CUSTOMERS (ADMIN / SALES) ---------------- #

@customer_routes.route("/list", methods=["GET"])
def list_all_customers():
    session = validate_session(request)
    if not session or session["role"] not in ["sales", "admin"]:
        return jsonify({"error": "Unauthorized"}), 403

    docs = list(customers.find({}))
    for c in docs:
        c["_id"] = str(c["_id"])

    return jsonify(docs)

# ---------------- GET CUSTOMER BY EMAIL ---------------- #
@customer_routes.route("/by-email/<email>", methods=["GET"])
def get_customer_by_email(email):
    session = validate_session(request)
    if not session:
        return jsonify({"error": "Unauthorized"}), 403
    
    customer = customers.find_one({"email": email})
    
    if not customer:
        return jsonify({"error": "Customer not found"}), 404
    
    customer["_id"] = str(customer["_id"])
    return jsonify(customer)