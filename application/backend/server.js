const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const userRoutes = require("./routes/routes"); // Import the user routes
const discussionRoutes = require("./routes/discussionroutes"); // Discussion routes

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins for testing; restrict in production
  },
});

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
  socket.on("time-message", (data) => {
    console.log("Received from client:", data);

    // Respond with acknowledgment
    const acknowledgment = {
      status: "success",
      message: "Message received successfully!",
      receivedAt: new Date().toISOString(),
    };
    socket.emit("acknowledgment", acknowledgment);
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
