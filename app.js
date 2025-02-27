const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const User = require("./models/user");

const PORT = process.env.PORT || 5000;

app.get("/", async (req, res) => {
  const message = "Hello World";
  console.log(req.method);

  res.send(message);
});

app.post("/api/login", (req, res) => {
  console.log("trying to login");
  res.json({ status: 200 });
});

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
