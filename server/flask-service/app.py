import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from services.classifier import (
    generate_professional_reply,
    summarize_email_content
)
from services.embedding_classifier import classify_with_embeddings

load_dotenv()

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "Flask AI Service Running"


@app.route("/classify", methods=["POST"])
def classify():
    data = request.json
    emails = data.get("emails", [])
    categories = data.get("categories", [])
    result = classify_with_embeddings(emails, categories)
    return jsonify(result)


@app.route("/reply", methods=["POST"])
def reply():
    data = request.json
    result = generate_professional_reply(
        data.get("subject"),
        data.get("snippet")
    )
    return jsonify({"reply": result})


@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.json
    result = summarize_email_content(
        data.get("subject"),
        data.get("snippet")
    )
    return jsonify({"summary": result})


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=True)
