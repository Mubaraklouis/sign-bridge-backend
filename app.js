
const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const authenticate = require("./middleware/authenticate");

const connectDB = require("./config/db");
const User = require("./models/user");

// const authenticate = require("./middleware/authMiddleware");
const PORT = process.env.PORT || 80;

connectDB();

const jsonParser = bodyParser.json();

app.get("/", async (req, res) => {
  const message = "Hello World";
  console.log(req.method);

  res.send(message);
});

// end-point for login in users
app.post("/api/login", jsonParser, async (req, res) => {
  // here I want to check if there's user in the db
  const data = JSON.stringify(req.body);

  try {
    const userDB = await User.findOne({ email: req.body.email });

    if (userDB == null) {
      res.sendStatus(404);
    } else {
      console.log(userDB);
      const token = await authenticate.checkPassword(
        `${req.body.password}`,
        userDB
      );
      if (token) {
        res.json({ accessToken: token });
      } else {
        return res.sendStatus(401);
      }
    }
  } catch (e) {
    console.log(e);
  }
});

// end-point for registering users
app.post("/api/register", jsonParser, async (req, res) => {
  try {
    const userDB = await User.findOne({ email: req.body.email });
    if (userDB == null) {
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });
      user.save();
    } else {
      return res.sendStatus(400);
    }
  } catch (e) {
    console.log("Error occured: ", e);
  }

  res.sendStatus(200);
});

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.listen(PORT, "10.39.204.206", () => {
  console.log(`app listening on port ${PORT}`);
});
app.use(bodyParser.json());
app.use(cors(corsOptions));
=======
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
