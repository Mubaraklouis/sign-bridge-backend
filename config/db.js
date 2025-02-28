const mongoose = require("mongoose");

const uri = process.env.CONNECTION_STRING;
const URI =
  "mongodb+srv://juniorab444:7VGE8DWTbYItcEWL@cluster0.cj0a2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster";

const connectDB = async () => {
  try {
    await mongoose.connect(`${uri}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
};

module.exports = connectDB;
