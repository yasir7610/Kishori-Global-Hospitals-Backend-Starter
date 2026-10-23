
require("dotenv").config();
const mongoose = require("mongoose");

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      autoSelectFamily: false
    });

    console.log("MongoDB connected successfully!");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Connection failed:", error.message);
  }
}

testConnection();
