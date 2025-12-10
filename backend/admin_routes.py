from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from auth import validate_session
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

admin_routes = Blueprint("admin_routes", __name__)

mongo = MongoClient(os.getenv("MONGODB_URI"))
db = mongo[os.getenv("MONGODB_DB")]
products = db[os.getenv("MONGODB_PRODUCTS_COLLECTION")]

# ---- AUTH CHECK ----
def require_admin(req):
    session = validate_session(req)
    if not session or session["role"] != "admin":
        return None
    return session


@admin_routes.route("/products", methods=["GET"])
def get_products():
    if not require_admin(request):
        return jsonify({"error": "Unauthorized"}), 403

    items = list(products.find({}))
    for item in items:
        item["_id"] = str(item["_id"])

    return jsonify(items)



@admin_routes.route("/add-product", methods=["POST"])
def add_product():
    if not require_admin(request):
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json
    products.insert_one(data)
    return jsonify({"msg": "Added"})


@admin_routes.route("/delete-product/<id>", methods=["DELETE"])
def delete_product(id):
    if not require_admin(request):
        return jsonify({"error": "Unauthorized"}), 403

    products.delete_one({"_id": ObjectId(id)})
    return jsonify({"msg": "Deleted"})
