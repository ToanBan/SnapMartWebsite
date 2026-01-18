from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import redis
import numpy as np

REDIS_HOST = "localhost"
REDIS_PORT = 6379

app = FastAPI()

model = SentenceTransformer("intfloat/multilingual-e5-base")

r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=False)

class EmbedRequest(BaseModel):
    product_id: int
    name: str
    description: str

@app.post("/embed/product")
def embed_product(data: EmbedRequest):
    print("🔥 RECEIVED:", data)

    text = f"{data.name}. {data.description}"
    vector = model.encode(text)
    vec_bytes = np.array(vector, dtype=np.float32).tobytes()

    r.hset(
        f"product:{data.product_id}",
        mapping={"vector": vec_bytes}
    )
    return {
        "status": "ok",
        "product_id": data.product_id,
        "dim": len(vector)
    }
