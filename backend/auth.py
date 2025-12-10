# backend/auth.py

from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import datetime, os, uuid
from dotenv import load_dotenv

load_dotenv()

auth = Blueprint("auth", __name__)

mongo = MongoClient(os.getenv("MONGODB_URI"))
db = mongo[os.getenv("MONGODB_DB")]
users = db["users"]
sessions = db["sessions"]


def create_session(user):
    session_id = f"session_{uuid.uuid4().hex}"
    doc = {
        "_id": session_id,
        "userId": str(user["_id"]),
        "role": user["role"],
        "email": user.get("email", ""),  # <-- ADD THIS
        "createdAt": datetime.datetime.utcnow(),
        "expiresAt": datetime.datetime.utcnow() + datetime.timedelta(hours=12)
    }
    sessions.insert_one(doc)
    return session_id


def validate_session(req):
    session_id = req.headers.get("x-session-id")
    if not session_id:
        return None

    session = sessions.find_one({"_id": session_id})
    if not session:
        return None

    if session["expiresAt"] < datetime.datetime.utcnow():
        return None

    return session


@auth.route("/register", methods=["POST"])
def register():
    data = request.json
    hashed = generate_password_hash(data["password"])

    doc = {
        "name": data["name"],
        "email": data["email"],
        "password": hashed,
        "role": data["role"]
    }

    users.insert_one(doc)
    return jsonify({"msg": "User registered"})


@auth.route("/login", methods=["POST"])
def login():
    data = request.json
    user = users.find_one({"email": data["email"]})

    if not user or not check_password_hash(user["password"], data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    session_id = create_session(user)

    return jsonify({
        "sessionId": session_id,
        "userId": str(user["_id"]),   # <-- ADD THIS
        "role": user["role"],
        "email": user["email"],
        "name": user["name"]
    })