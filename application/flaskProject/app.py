from flask import Flask, jsonify, request, render_template
import joblib
import os
import pandas as pd
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import PyPDF2
from openai import OpenAI
import logging

app = Flask(__name__)
CORS(app)
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app)

# Define the path to the best model
MODEL_PATH = "models/best_model.pkl"

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


# Load the best trained model
def load_model():
    """Load the pre-trained model from disk."""
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError("No trained model found. Please train the model first.")
    return joblib.load(MODEL_PATH)


# Routes related to model training and prediction
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
    """
    Make a prediction using the best trained model.

    Accepts JSON input, processes it, and returns a prediction. The input must
    contain the necessary features (excluding ParticipantID), and the model will
    be used to generate predictions.
    """
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
    Handle chatbot requests based on the uploaded PDF content.

    This route takes a question from the user and responds with a helpful hint
    based on the content of the previously uploaded PDF file.
    """
    question = request.json.get("message")
    if not question:
        return jsonify({"error": "No question provided."}), 400

    # Example context (replace with your actual context source)
    context = (
        "This is a dummy python context for testing. Python is a programming language "
        "that lets you work quickly and integrate systems more effectively."
    )

    try:
        # Call OpenAI API to generate a response
        response = client.chat.completions.create(
            model="gpt-4o",  # Replace with the appropriate model version
            messages=[
                {"role": "system", "content": f"Context: {context}. Help as a tutor."},
                {"role": "user", "content": question},
            ],
            temperature=0.7,
        )

        # Extract the assistant's response
        answer = response.choices[0].message.content.strip()
        return jsonify({"answer": answer})

    except Exception as e:
        logging.error(f"An error occurred: {e}")
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
