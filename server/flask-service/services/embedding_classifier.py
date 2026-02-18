from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import torch

model = SentenceTransformer("all-MiniLM-L6-v2")

_cached_categories = None
_cached_embeddings = None
THRESHOLD = 0.35

CATEGORY_PROTOTYPES = {
    "Important": "urgent messages, deadlines, personal important communication, requires immediate attention",
    "Work": "project discussions, meetings, tasks, office communication, job related emails",
    "Personal": "friends, family, personal conversations, informal communication",
    "Finance": "bank, transactions, credit card, payment, invoices, salary",
    "Promotions": "marketing email, product launch, announcement, new feature, platform update, newsletter, promotional email, offers, sales, developer tools update",
    "Social": "linkedin, facebook, instagram, social network notifications",
    "Updates": "system updates, newsletters, product announcements, notifications",
    "Spam": "junk email, phishing, lottery, fake offers, unknown senders",
    "Travel": "flight booking, hotel reservation, trip confirmation",
    "Others": "uncategorized emails"
}

def _prepare_text(email):
    subject = email.get("subject", "")
    snippet = email.get("snippet", "")
    sender = email.get("from", "")

    return f"""
    Subject: {subject}
    From: {sender}
    Content: {snippet}
    """


def _get_category_embeddings(categories):
    global _cached_categories, _cached_embeddings

    if _cached_categories is not None and set(categories) == set(_cached_categories):
        return _cached_embeddings

    texts = [
        CATEGORY_PROTOTYPES.get(cat, cat)
        for cat in categories
    ]

    embeddings = model.encode(
        texts,
        convert_to_numpy=True,
        normalize_embeddings=True,
        batch_size=32
    )

    _cached_categories = categories
    _cached_embeddings = embeddings

    return embeddings


def classify_with_embeddings(emails, categories):

    if not emails:
        return []

    texts = [_prepare_text(e) for e in emails]

    with torch.no_grad():
        email_embeddings = model.encode(
            texts,
            convert_to_numpy=True,
            normalize_embeddings=True,
            batch_size=32
        )

    category_embeddings = _get_category_embeddings(categories)

    similarity_matrix = cosine_similarity(email_embeddings, category_embeddings)

    results = []

    for i, email in enumerate(emails):
        scores = similarity_matrix[i]

        best_index = int(np.argmax(scores))

        results.append({
            "id": email["id"],
            "category": categories[best_index],
            "confidence": float(scores[best_index])
        })

    return results
