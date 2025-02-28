require("dotenv").config();
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.TOKEN_SECRET;
const EXPIRATION_TIME = process.env.EXPIRATION_TIME;

function generateAccessToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRATION_TIME });
}

module.exports = { generateAccessToken };
