'''from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import google.generativeai as genai

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config=generation_config,
)

@app.route("/generate-summary", methods=["POST"])
def generate_summary():
    data = request.json
    research_details = data.get("details", "")

    if not research_details:
        return jsonify({"error": "No details provided"}), 400

    chat_session = model.start_chat(history=[])

    prompt = f"""Given the following summary:
{research_details}

Expand this into a **detailed and well-structured response** with **only 2-3 paragraphs** while maintaining clarity and depth. Ensure that:
- Each paragraph has a blank line before the next one.
- The explanation is **concise yet informative**, covering key aspects without unnecessary expansion.

### **Structure:**
1. **Introduction**: Briefly introduce the topic and its importance in research.
  
2. **Key Technical Insights**: Summarize the main methods, techniques, or findings in a **crisp and structured manner**.

3. **Real-World Applications / Challenges**: If space allows, discuss either **practical applications** or **challenges in implementation**.

Make sure each paragraph has a **logical flow** and is separated by a **blank line**.
"""

    response = chat_session.send_message(prompt)

    # Ensure response is properly handled
    if hasattr(response, "text"):
        return jsonify({"summary": response.text})
    else:
        return jsonify({"error": "Failed to generate summary"}), 500

@app.route("/", methods=["GET"])
def home():
    return "Flask server is running!"

if __name__ == "__main__":
    app.run(debug=True)
'''

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd
import google.generativeai as genai
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from datetime import datetime

load_dotenv()  # Load .env file if exists

app = Flask(__name__)
CORS(app)

# Configure Gemini AI API key from environment
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config=generation_config,
)

# Allowed file extensions for upload
ALLOWED_EXTENSIONS = {"xls", "xlsx"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/generate-summary", methods=["POST"])
def generate_summary():
    # Check if file part is present
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files["file"]
    
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    # Read filters from form data
    from_date_str = request.form.get("from_date")
    to_date_str = request.form.get("to_date")
    pub_type = request.form.get("publication_type")
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        try:
            df = pd.read_excel(file)

            if "Details" not in df.columns:
                return jsonify({"error": "Excel missing 'Details' column"}), 400
            print("Excel Columns:", df.columns.tolist())
            df = pd.read_excel(file)
            print("Excel Columns:", df.columns.tolist())             
            # Convert Date column to datetime if it exists
            if "Date" in df.columns:
                df["Date"] = pd.to_datetime(df["Date"], errors="coerce")

                if from_date_str:
                    from_date = datetime.strptime(from_date_str, "%Y-%m-%d")
                    df = df[df["Date"] >= from_date]
                if to_date_str:
                    to_date = datetime.strptime(to_date_str, "%Y-%m-%d")
                    df = df[df["Date"] <= to_date]

            # Filter by publication type if specified and not default placeholder
            if pub_type and pub_type.lower() != "publication type":
                df = df[df["Publication Type"].str.lower() == pub_type.lower()]

            combined_text = "\n\n".join(df["Details"].dropna().astype(str).tolist())

            if not combined_text.strip():
                return jsonify({"error": "No text in 'Details' column after filtering"}), 400

            # Start Gemini chat session
            chat_session = model.start_chat(history=[])
            
            prompt = f"""Given the following research details extracted from an Excel file:
{combined_text}

Expand this into a **detailed and well-structured response** with **only 2-3 paragraphs** while maintaining clarity and depth. Make sure the paragraphs have logical flow and blank lines between them."""

            response = chat_session.send_message(prompt)

            if hasattr(response, "text"):
                return jsonify({"summary": response.text})
            else:
                return jsonify({"error": "Failed to generate summary"}), 500
        except Exception as e:
            return jsonify({"error": f"Exception: {str(e)}"}), 500
    else:
        return jsonify({"error": "Invalid file type"}), 400

@app.route("/", methods=["GET"])
def home():
    return "Flask server is running!"

if __name__ == "__main__":
    app.run(debug=True)

