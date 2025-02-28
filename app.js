
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
require("dotenv").config();
const authenticate = require("./middleware/authenticate");
const ngrok = process.env.ENABLE_TUNNEL ? require("ngrok") : false;
const connectDB = require("./config/db");
const User = require("./models/user");
const app = express();
const server = http.createServer(app);
const jsonParser = require("body-parser").json();
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (for development)
    methods: ['GET', 'POST'], // Allowed HTTP methods
  },
});



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



connectDB();

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



app.use(cors(corsOptions));

// API Routes
app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from the API!" });
});

app.post("/api/send-message", (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Emit the message to all connected Socket.IO clients
  io.emit("message", message);
  res.json({ success: true, message: "Message sent to all clients" });
});

// Socket.IO Connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle incoming messages from clients
  socket.on("message", (data) => {
    console.log("Received message:", data);
    // Broadcast the message to all clients
    io.emit("message", data);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});



// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
    ngrok
    .connect(PORT)
    .then((ngrokUrl) => {
      console.log(`Ngrok tunnel in: ${ngrokUrl}`);
    })
    .catch((error) => {
      console.log("Couldn't tunnel");
    });
});

