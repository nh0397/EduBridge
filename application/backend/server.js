const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const axios = require("axios"); // Import axios for HTTP requests

const userRoutes = require("./routes/routes"); // Import the user routes
const discussionRoutes = require("./routes/discussionroutes"); // Discussion routes

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins for testing; restrict in production
  },
});

const FLASK_API_URL = "http://127.0.0.1:5000/predict"; // Flask prediction endpoint
const PORT = process.env.PORT || 3001;

// Configure CORS to expose specific headers
const corsOptions = {
  exposedHeaders: ["Content-Disposition", "X-Suggested-Filename"], // Add other headers if needed
};

app.use(cors(corsOptions)); // Use customized CORS options
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use userRoutes for any request that comes to '/'
app.use("/", userRoutes);
app.use("/api/discussions", discussionRoutes); // Use discussion routes

// WebSocket connection
io.on("connection", (socket) => {
  console.log("Client connected!");

  // Handle "time-message" event from the client
  socket.on("time-message", async (data) => {
    console.log("Received from client:", data);

    try {
      // Add ParticipantID and AssignmentID to the payload
      const payload = {
        participantID: 1, // Hardcoded for now, update as needed
        ...data, // Merge the incoming data
      };

      console.log("Payload sent to Flask:", payload);

      // Send data to the Flask server for prediction
      const response = await axios.post(FLASK_API_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });

      // Send prediction result back to the client
      socket.emit("prediction-result", {
        status: "success",
        prediction: response.data.prediction,
        message: response.data.message,
        receivedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error calling Flask API:", error.message);

      // Send error back to the client
      socket.emit("prediction-result", {
        status: "error",
        message: "Failed to get prediction from Flask API.",
        details: error.message,
      });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected!");
  });
});


// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
