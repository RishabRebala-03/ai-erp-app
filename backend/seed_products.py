import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

client = MongoClient(os.getenv("MONGODB_URI"))
db = client[os.getenv("MONGODB_DB")]
col = db[os.getenv("MONGODB_PRODUCTS_COLLECTION")]

products = [
    # --- EXECUTIVE CHAIR ---
    {
        "itemNo": "3001",
        "product": "FLINTAN High-Back Executive Chair",
        "productId": "IK-CH-3001",
        "shortText": "Ergonomic high-back office chair",
        "description": "Premium executive chair with cushioned support, tilt control, and smooth swivel base.",
        "productGroup": "Chair",
        "price": 9999,
        "supplier": "IKEA",
        "store": "IKEA Hyderabad",
        "stockQuantity": 50,
        "tags": ["executive", "office chair", "black", "ergonomic"]
    },

    # --- VISITOR CHAIRS (2 in image) ---
    {
        "itemNo": "3002",
        "product": "LÅNGFJÄLL Visitor Chair",
        "productId": "IK-CH-3002",
        "shortText": "Modern visitor chair with chrome legs",
        "description": "Mid-back office visitor chair with ribbed cushioning and aluminum frame.",
        "productGroup": "Chair",
        "price": 7499,
        "supplier": "IKEA",
        "store": "IKEA Hyderabad",
        "stockQuantity": 80,
        "tags": ["visitor chair", "black", "office chair"]
    },

    # --- EXECUTIVE DESK ---
    {
        "itemNo": "4001",
        "product": "BEKANT Executive Office Desk",
        "productId": "IK-DS-4001",
        "shortText": "Large executive desk with wooden top",
        "description": "Spacious executive desk with black matte storage base and premium dark wood top.",
        "productGroup": "Desk",
        "price": 19999,
        "supplier": "IKEA",
        "store": "IKEA Hyderabad",
        "stockQuantity": 25,
        "tags": ["desk", "office desk", "executive"]
    },

    # --- WALL SHELVING UNIT ---
    {
        "itemNo": "5001",
        "product": "BROR Wall Shelving Unit",
        "productId": "IK-SH-5001",
        "shortText": "Black wall-mounted shelving system",
        "description": "Industrial-style shelving unit with black frame and wooden shelves.",
        "productGroup": "Storage",
        "price": 14999,
        "supplier": "IKEA",
        "store": "IKEA Hyderabad",
        "stockQuantity": 40,
        "tags": ["shelf", "storage", "wood", "black metal"]
    },

    # --- PLANT ---
    {
        "itemNo": "6001",
        "product": "FEJKA Potted Indoor Plant",
        "productId": "IK-PL-6001",
        "shortText": "Decorative tall indoor plant",
        "description": "Artificial indoor plant with a modern grey pot.",
        "productGroup": "Decor",
        "price": 1999,
        "supplier": "IKEA",
        "store": "IKEA Hyderabad",
        "stockQuantity": 120,
        "tags": ["plant", "decor", "green", "pot"]
    },

    # --- WALL ORGANIZER ---
    {
        "itemNo": "7001",
        "product": "SKÅDIS Wall Organizer Set",
        "productId": "IK-WO-7001",
        "shortText": "Wall-mounted corkboard organizer",
        "description": "Combination of corkboard and magnetic panels for office planning and notes.",
        "productGroup": "Office Accessories",
        "price": 2999,
        "supplier": "IKEA",
        "store": "IKEA Hyderabad",
        "stockQuantity": 60,
        "tags": ["corkboard", "wall organizer", "office accessories"]
    }
]

# Clear old data
col.delete_many({})

# Insert new data
col.insert_many(products)

print("Office inventory seeded successfully!")