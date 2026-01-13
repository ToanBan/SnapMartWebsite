import os
import json
import numpy as np
import redis
from tqdm import tqdm

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
EMBEDDING_FILE = os.path.join(BASE_DIR, "data", "product_vectors.json")
REDIS_HOST = "localhost"
REDIS_PORT = 6379
INDEX_NAME = "product_idx"
VECTOR_DIM = 768 
with open(EMBEDDING_FILE, "r", encoding="utf-8") as f:
    product_vectors = json.load(f)

print(f"Loaded {len(product_vectors)} product embeddings")

r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=False)

for p in tqdm(product_vectors, desc="Pushing to Redis"):
    key = f"product:{p['id']}"

    if r.exists(key):
        r.delete(key)

    vec_bytes = np.array(p['vector'], dtype=np.float32).tobytes()

    r.hset(
        key,
        mapping={
            "product_id": p["id"],
            "embedding": vec_bytes
        }
    )

print("All embeddings pushed to Redis successfully!")
