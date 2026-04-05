// Vercel serverless function entry point
import app from "../src/app.js";

// Connect to database once on cold start
import { connectDB } from "../src/config/db.js";

let isConnected = false;

const connectOnce = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

export default async (req, res) => {
  try {
    await connectOnce();
    return app(req, res);
  } catch (error) {
    console.error("Serverless function error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};