const express = require("express");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const User = require("./models/user");
const tokenGeneration = require("./middleware/generateToken");

// const authenticate = require("./middleware/authMiddleware");
const PORT = process.env.PORT || 5000;

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
    const userDB = await User.findOne({ email: data.email });
    if (userDB == null) {
      res.sendStatus(404);
    } else {
      console.log(userDB);
      // generateAccessToken
      const token = tokenGeneration.generateAccessToken({
        email: userDB.email,
      });
      res.json({ accessToken: token });
    }
  } catch (e) {
    console.log(e);
  }
});

// end-point for registering users
app.post("/api/register", jsonParser, async (req, res) => {
  const data = req.body;

  const user = await mongoose.User.create(data);
  user.save();

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
app.use(bodyParser.json());
