import os
import json
from sentence_transformers import SentenceTransformer
from tqdm import tqdm
import numpy as np
import redis


BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_FILE = os.path.join(BASE_DIR, "data", "products_for_embeddings.json")


with open(DATA_FILE, "r", encoding="utf-8") as f:
    products = json.load(f)

print(f"Loaded {len(products)} products")


model = SentenceTransformer("intfloat/multilingual-e5-base")


product_vectors = []
for p in tqdm(products, desc="Encoding products"):
    vector = model.encode(p["text"])
    product_vectors.append({
        "id": p["id"],
        "vector": vector.tolist()  
    })


EMBEDDING_FILE = os.path.join(BASE_DIR, "data", "product_vectors.json")
with open(EMBEDDING_FILE, "w", encoding="utf-8") as f:
    json.dump(product_vectors, f, ensure_ascii=False, indent=2)

print(f"Saved {len(product_vectors)} embeddings to {EMBEDDING_FILE}")


r = redis.Redis(host="localhost", port=6379, db=0)

for p in product_vectors:
    vec_bytes = np.array(p['vector'], dtype=np.float32).tobytes()
    r.hset(f"product:{p['id']}", mapping={"vector": vec_bytes})


