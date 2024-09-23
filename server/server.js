require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const scoreRoutes = require('./routes/scoreRoutes');
const connectDB = require('./config/db');
// const PORT = process.env.PORT || 5000;
const PORT = 5000;


// Initialize the server
const app = express();
const server = http.createServer(app);
// const io = new Server(server);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Your front-end URL
    methods: ["GET", "PATCH"]
  }
});

// app.use(cors());
// TODO:
// CORS setup: Specific origin ko allow kar rahe hain
app.use(cors({
  origin: 'http://localhost:3000', // Tumhara frontend ka URL
  methods: ['GET', 'PATCH'],
 // credentials: true // Agar cookies ya authentication ki zarurat ho
}));
// TODO:

app.use(express.json());

app.set('io', io);
// MongoDB Connection
connectDB();

// middleware API Routes
app.use('/api/scores', scoreRoutes); 

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('User connected');
// ==========================

// socket.on('scoreUpdate', (updatedScore) => {
//   // Broadcast the updated score to all connected clients
//   io.emit('scoreUpdated', updatedScore);
// });
// ==============


  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
