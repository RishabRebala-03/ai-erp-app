from pymongo import MongoClient
from werkzeug.security import generate_password_hash
import os
from dotenv import load_dotenv

load_dotenv()

mongo = MongoClient(os.getenv("MONGODB_URI"))
db = mongo[os.getenv("MONGODB_DB")]
users = db["users"]

users.delete_many({})

docs = [
    {
        "name": "Admin User",
        "email": "admin@naxrita.com",
        "password": generate_password_hash("admin123"),
        "role": "admin"
    },
    {
        "name": "Sales Executive",
        "email": "sales@naxrita.com",
        "password": generate_password_hash("sales123"),
        "role": "sales"
    },
    {
        "name": "John Customer",
        "email": "customer@naxrita.com",
        "password": generate_password_hash("customer123"),
        "role": "customer"
    }
]

users.insert_many(docs)

print("Users seeded with hashed passwords!")