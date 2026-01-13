import sys
import json
from sentence_transformers import SentenceTransformer

text = sys.argv[1]

model = SentenceTransformer("intfloat/multilingual-e5-base")

embedding = model.encode(text)

print(json.dumps(embedding.tolist()))
