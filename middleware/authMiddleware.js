const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.TOKEN_SECRET;

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;
next(); }); }