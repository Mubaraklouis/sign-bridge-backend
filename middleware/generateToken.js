const jwt = require("jsonwebtoken");

const {
  TOKEN_SECRET: SECRET_KEY,
  EXPIRATION_TIME,
} = require("../config/env");

function generateAccessToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRATION_TIME });
}

module.exports = { generateAccessToken };
