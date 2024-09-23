require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const scoreRoutes = require("./routes/scoreRoutes");
const path = require("path");

const connectDB = require("./config/db");
const PORT = process.env.PORT || 5001;

// Initialize the server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Your front-end URL
    methods: ["GET", "PATCH"],
  },
});

// CORS setup: Specific origin is allowed
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "PATCH"],
    // credentials: true // Enable this if you need cookies or authentication
  })
);

app.use(express.json());

app.set("io", io);
// MongoDB Connection
connectDB();

// API Routes
app.use("/api/scores", scoreRoutes);

// Socket.io for real-time updates
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Serve the static files from the React app (build folder)
app.use(express.static(path.join(__dirname, "./client/build")));

// Serve the index.html for any unknown routes, enabling client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build", "index.html"));
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
