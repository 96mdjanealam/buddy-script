import dns from "dns";

if (process.env.NODE_ENV !== "production") {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}

import mongoose from "mongoose";

import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/buddy-script";

async function fix() {
  try {
    console.log("Connecting to MongoDB:", MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    const db = mongoose.connection.db;
    if (!db) {
        console.error("No db connection");
        return;
    }

    // Drop old conflicting indexes
    try {
      await db.collection("likes").dropIndex("post_1_user_1");
      console.log("Successfully dropped legacy index: post_1_user_1");
    } catch (e: any) {
      console.log("Index post_1_user_1 does not exist or already dropped:", e.message);
    }

    try {
      await db.collection("likes").dropIndex("comment_1_user_1");
      console.log("Successfully dropped legacy index: comment_1_user_1");
    } catch (e: any) {
      console.log("Index comment_1_user_1 does not exist or already dropped:", e.message);
    }

    console.log("Database index synchronization complete.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  }
}

fix();
