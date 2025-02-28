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

// Store user sockets
const users = {}; // { userId: socket }

// API Routes
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

app.post('/api/send-message', (req, res) => {
  const { message, userId } = req.body;
  if (!message || !userId) {
    return res.status(400).json({ error: 'Message and userId are required' });
  }

  // Send the message to the specific user
  if (users[userId]) {
    users[userId].emit('message', message);
    res.json({ success: true, message: `Message sent to user ${userId}` });
  } else {
    res.status(404).json({ error: `User ${userId} not found` });
  }
});

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Assume the client sends a userId during connection
  const userId = socket.handshake.auth.userId; // Or use query parameters: socket.handshake.query.userId
  if (userId) {
    // Store the socket with the userId
    users[userId] = socket;
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  }

  // Handle incoming private messages from clients
  socket.on('private-message', (data) => {
    console.log('Received private message:', data);
    const { to, message } = data;

    // Check if the target user is connected
    if (users[to]) {
      users[to].emit('message', message); // Send the message to the target user
      console.log(`Message sent to user ${to}`);
    } else {
      console.log(`User ${to} not found`);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    // Remove the user from the users object
    if (userId) {
      delete users[userId];
    }
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});