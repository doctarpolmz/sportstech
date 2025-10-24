from flask import Flask, request, jsonify

app = Flask(__name__)

@app.get("/health")
def health():
    return jsonify({"status": "ok"})

@app.post("/score")
def score():
    data = request.get_json(force=True, silent=True) or {}
    # Placeholder: simple weighted score
    ari = int(data.get("ari", 50))
    frl = int(data.get("frl", 50))
    bonus = int(data.get("bonus", 0))
    total = max(0, min(200, ari + frl + bonus))
    return jsonify({"ari": ari, "frl": frl, "bonus": bonus, "total": total})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
