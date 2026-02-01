const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const { GameManager } = require('./gameManager');

const app = express();
const server = http.createServer(app);

// Allow CORS for development (Vite runs on 5173 by default)
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all for now to simplify local dev
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Initialize Game Manager
const gameManager = new GameManager(io);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_game', (data) => {
    gameManager.handleJoin(socket, data);
  });

  socket.on('move_player', (data) => {
    gameManager.handleMove(socket, data);
  });

  socket.on('confirm_answer', () => {
    gameManager.handleConfirm(socket);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    gameManager.handleDisconnect(socket);
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
