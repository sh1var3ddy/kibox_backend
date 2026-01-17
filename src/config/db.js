import mongoose from "mongoose";
import { MONGO_URI } from "./server.config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      autoIndex: true
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    // process.exit(1); // Do not exit process in serverless environment
    throw err;
  }
};

export default connectDB;
