"""
ԱԲ Հոսքի Աստղագիտարան — AI չաթի backend

Այս սերվերը՝
  1) սպասարկում է կայքի HTML/CSS/JS ֆայլերը,
  2) ընդունում է /api/chat հարցումները browser-ից,
  3) փոխանցում է դրանք Claude-ի API-ին՝ օգտագործելով ANTHROPIC_API_KEY
     environment փոփոխականը (երբեք բանալին HTML/JS ֆայլերում մի դիր!).

Գործարկում.
  1. pip install flask flask-cors anthropic
  2. Ստացիր API key՝ https://console.anthropic.com -ից
  3. export ANTHROPIC_API_KEY="քո-բանալին"   (Windows: set ANTHROPIC_API_KEY=...)
  4. python server.py
  5. Բացիր բրաուզերում՝ http://localhost:5000
"""

import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import anthropic

app = Flask(__name__, static_folder=".", static_url_path="")
CORS(app)

client = anthropic.Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY")
)

SYSTEM_PROMPT = (
    "Դու օգնական ես ուսումնական կայքի համար՝ ԱԲ հոսքի 10-12-րդ դասարանների "
    "աշակերտների համար։ Պատասխանիր հայերեն, հստակ և հակիրճ, օգնելով "
    "աշակերտներին հասկանալ դասընթացային նյութը։"
)


@app.route("/")
def home():
    return send_from_directory(".", "index.html")


@app.route("/api/chat", methods=["OPTIONS"])
def chat_preflight():
    # Used by the frontend to check whether the backend is running.
    return ("", 204)


@app.route("/api/chat", methods=["POST"])
def chat():
    if not os.environ.get("ANTHROPIC_API_KEY"):
        return jsonify({"error": "ANTHROPIC_API_KEY սահմանված չէ սերվերի վրա"}), 500

    data = request.get_json(force=True) or {}
    messages = data.get("messages", [])

    if not messages:
        return jsonify({"error": "messages դաշտը դատարկ է"}), 400

    try:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=800,
            system=SYSTEM_PROMPT,
            messages=messages,
        )
        reply_text = "".join(
            block.text for block in response.content if block.type == "text"
        )
        return jsonify({"reply": reply_text})

    except Exception as exc:  # noqa: BLE001
        return jsonify({"error": str(exc)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
