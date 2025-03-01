const mongoose = require("mongoose");
const { Schema } = mongoose;

// Participant Sub-Schema (for ChatRoom)
const participantSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  joinedAt: { type: Date, default: Date.now },
  lastRead: { type: Date },
});

// ChatRoom Schema
const chatRoomSchema = new Schema({
  type: { type: String, enum: ["private", "group"], required: true },
  participants: [participantSchema],
  name: { type: String }, // Only for group chats
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

module.exports = { ChatRoom };
