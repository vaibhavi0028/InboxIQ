import os
import json
import time
from google import genai
from google.genai import types

MODEL_NAME = "gemini-2.0-flash" 

client = None

def get_ai_client():
    global client
    if client is None:
        key = os.getenv("GEMINI_API_KEY")
        if not key:
            raise ValueError("GEMINI_API_KEY missing")
        client = genai.Client(api_key=key)
    return client

def _generate(prompt: str, is_json=False):
    c = get_ai_client()
    config = {}
    if is_json:
        config = types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    
    response = c.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config=config
    )
    return response.text

def generate_professional_reply(subject, snippet):
    prompt = f"Write a professional email reply for: Subject: {subject}, Content: {snippet}. Keep it under 100 words."
    return _generate(prompt)

def summarize_email_content(subject, snippet):
    prompt = f"Summarize this email in exactly 2 sentences: Subject: {subject}, Content: {snippet}."
    return _generate(prompt)