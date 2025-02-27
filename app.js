const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (for development)
    methods: ['GET', 'POST'], // Allowed HTTP methods
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

app.post('/api/send-message', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Emit the message to all connected Socket.IO clients
  io.emit('message', message);
  res.json({ success: true, message: 'Message sent to all clients' });
});

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle incoming messages from clients
  socket.on('message', (data) => {
    console.log('Received message:', data);
    // Broadcast the message to all clients
    io.emit('message', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});