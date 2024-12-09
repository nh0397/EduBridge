from flask import Flask, jsonify, request, render_template
import joblib
import os
import pandas as pd
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import PyPDF2
from openai import OpenAI
import logging
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app)

# Define the path to the best model
MODEL_PATH = "models/best_model.pkl"

# Initialize OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# make a ocntext folder for chat conversation
CONTEXT_FOLDER = "context"
os.makedirs(CONTEXT_FOLDER, exist_ok=True)


# Read PDF content at startup
PDF_FOLDER = "pdfs"  # Folder containing the PDF
PDF_FILE = os.path.join(PDF_FOLDER, "answer_document.pdf")  # Specify your file here
PDF_CONTENT = ""

def load_pdf_content(pdf_path):
    """
    Load and extract text content from the specified PDF file.
    """
    if not os.path.exists(pdf_path):
        logging.error(f"PDF file not found: {pdf_path}")
        return "No PDF content available. Please upload a valid PDF."

    try:
        with open(pdf_path, "rb") as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            print('here is the text', text)
            return text

    except Exception as e:
        logging.error(f"Error reading PDF: {e}")
        return "Error reading PDF content."


# Load PDF content at startup
PDF_CONTENT = load_pdf_content(PDF_FILE)



# Load the best trained model
def load_model():
    """Load the pre-trained model from disk."""
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError("No trained model found. Please train the model first.")
    return joblib.load(MODEL_PATH)


# Routes related to model training and prediction for textual data
@app.route("/train", methods=["POST"])
def train_models():
    """
    Train new models and store the best one.

    This route triggers the training process, saves the best model based on
    the F1 score, and returns the name and F1 score of the best model.
    """
    from train_models import (
        train_and_save_best_model,
    )  # Import training script dynamically

    best_model_name, best_f1 = train_and_save_best_model()
    return jsonify(
        {
            "message": "Model training completed.",
            "best_model": best_model_name,
            "best_f1_score": best_f1,
        }
    )


@app.route("/best-model", methods=["GET"])
def get_best_model():
    """
    Retrieve details of the best trained model.

    Returns the details of the currently available best model or an error message
    if no model is found.
    """
    if not os.path.exists(MODEL_PATH):
        return (
            jsonify({"error": "No trained model found. Please train the model first."}),
            404,
        )

    best_model = load_model()
    return jsonify(
        {"message": "Best model is ready.", "model_details": str(best_model)}
    )


@app.route("/predict", methods=["POST"])
def predict():
    if not os.path.exists(MODEL_PATH):
        return (
            jsonify({"error": "No trained model found. Please train the model first."}),
            404,
        )

    best_model = load_model()
    try:
        # Parse the JSON payload
        payload = request.get_json()
        if not payload:
            return jsonify({"error": "Invalid input. Please send JSON data."}), 400

        # Ensure ParticipantID is fixed to 1
        payload["ParticipantID"] = (
            1  # Add ParticipantID if missing or overwrite with fixed value
        )

        # Convert payload to DataFrame (assuming input is a single dict)
        input_data = pd.DataFrame(
            [payload]
        )  # Wrap payload in a list to create a DataFrame

        # Log the structure of the input data
        print("\nIncoming Request Data Format:")
        print("Feature Names:", list(input_data.columns))
        print("Sample Data:\n", input_data)

        # Make a prediction (drop ParticipantID for prediction)
        prediction = best_model.predict(input_data.drop(columns=["ParticipantID"]))[0]

        return jsonify({"prediction": prediction, "message": "Prediction successful"})

    except Exception as e:
        return jsonify({"error": f"An error occurred during prediction: {str(e)}"}), 500


# Routes related to chatbot and file upload
@app.route("/")
def home():
    """
    Render the homepage template.

    This route serves the homepage of the web application.
    """
    print("SERVER STARTED")
    return render_template("index.html")


@app.route("/upload-pdf", methods=["POST"])
def upload_pdf():
    """
    Upload a PDF and extract its text content.

    The extracted text is saved in the 'context' folder for later use by the chatbot.
    """
    file = request.files.get("file")

    if file:
        logging.info(f"Received file: {file.filename}")
    else:
        logging.error("No file received in the request.")

    if file and file.filename.endswith(".pdf"):
        # Extract text from the PDF
        pdf_text = extract_text_from_pdf(file)

        # Ensure 'context' folder exists
        os.makedirs("context", exist_ok=True)

        # Save the extracted text into pdf_context.txt inside the 'context' folder
        context_file_path = os.path.join("context", "pdf_context.txt")
        with open(context_file_path, "w") as f:
            f.write(pdf_text)

        logging.info(f"PDF content saved to: {context_file_path}")

        return jsonify({"message": "PDF uploaded and processed successfully."}), 200
    else:
        logging.error("Invalid file. Please upload a PDF.")
        return jsonify({"error": "Invalid file. Please upload a PDF."}), 400


def extract_text_from_pdf(pdf_file):
    """
    Extract text from an uploaded PDF file.

    Args:
        pdf_file: The PDF file to extract text from.

    Returns:
        str: The extracted text content.
    """
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text


@app.route("/chatbot", methods=["POST"])
def chatbot():
    """
    Handle chatbot requests based on user input, conversation history, and answers so far.
    """
    try:
        # Parse the incoming request
        data = request.get_json()
        print("Incoming request data:", data)

        # Extract message and history
        user_message = data.get("message", "").strip()
        conversation_history = data.get("history", "").strip()

        # Debugging: Print extracted data
        print(f"User Message: {user_message}")
        print(f"Conversation History: {conversation_history}")

        # Ensure message is provided
        if not user_message:
            print("Error: No user message provided.")
            return jsonify({"error": "No message provided."}), 400

        # Prepare the system prompt
        system_prompt = (
            f"Here is the user's progress so far:\n{conversation_history}\n\n"
            "You must only provide suggestions based on the user's question. "
            "Be strict in not giving the direct answer."
        )

        # Debugging: Print system prompt
        print(f"System Prompt: {system_prompt}")

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            temperature=0.7,
        )

        # Extract response content
        suggestion = response.choices[0].message.content.strip()

        # Debugging: Print response from OpenAI
        print(f"OpenAI Response: {suggestion}")

        return jsonify({"suggestion": suggestion})

    except Exception as e:
        # Debugging: Print exception details
        logging.error(f"An error occurred in the chatbot endpoint: {str(e)}")
        print(f"Exception: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


# Routes related to emotion monitoring
@app.route("/start-emotion-monitoring", methods=["POST"])
def start_emotion_monitoring():
    """
    Start emotion monitoring.

    This route triggers the start of emotion monitoring, which may involve
    connecting to sensors or systems for real-time emotion tracking.
    """
    return jsonify({"message": "Emotion monitoring started"})


@app.route("/stop-emotion-monitoring", methods=["POST"])
def stop_emotion_monitoring():
    """
    Stop emotion monitoring.

    This route terminates any ongoing emotion monitoring session.
    """
    return jsonify({"message": "Emotion monitoring stopped"})


@app.route("/emotion-data", methods=["POST"])
def emotion_data():
    """
    Receive and process emotion data.

    This route accepts emotion data (e.g., facial expressions) and identifies
    the dominant emotion based on the received expressions.
    """
    try:
        data = request.get_json()
        if "expressions" in data:
            expressions = data["expressions"]
            # Find the emotion with the highest probability
            dominant_emotion = max(expressions, key=expressions.get)
            return jsonify(
                {
                    "message": "Emotion data received successfully",
                    "dominant_emotion": dominant_emotion,
                    "expressions": expressions,
                }
            )
        else:
            return jsonify({"error": "No expressions data found"}), 400
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


# SocketIO event handlers
@socketio.on("connect")
def test_connect():
    """
    Handle WebSocket connection event.

    This event is triggered when a client successfully connects via SocketIO.
    """
    print("SOCKET CONNECTED")


@socketio.on("my event")
def handle_my_custom_event(json, methods=["GET", "POST"]):
    """
    Handle custom SocketIO events.

    This function processes custom events sent from clients via SocketIO.
    """
    print("received my event: " + str(json))


# Ensure the 'models' directory exists before starting the application
if __name__ == "__main__":
    # Ensure the 'models' directory exists
    os.makedirs("models", exist_ok=True)
    socketio.run(app, debug=True, host="0.0.0.0", port=5000)
