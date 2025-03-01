const mongoose = require("mongoose");
const { Schema } = mongoose;

// Message Schema
const messageSchema = new Schema({
  chatRoomId: { type: Schema.Types.ObjectId, ref: "ChatRoom", required: true },
  senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ["text", "image", "file"], default: "text" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = { Message };
