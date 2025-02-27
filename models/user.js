const mongoose = require("mongoose");

const userSchema = new Schema({
  username: String, // String is shorthand for {type: String}
  email: String,
  password: String,
  JoinDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
