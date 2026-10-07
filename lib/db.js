import mongoose from "mongoose";
import dotenv from "dotenv";

const mongourl = process.env.MONGODB_URI;

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongourl, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      })
      .then((mongoose) => mongoose);
  }
  try {
    cached.conn = await cached.promise;
    console.log("DB_STATUS: Connection successful. Ready to use.");
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    console.error("DB_STATUS: Database connection failed:", e);
  }
  return cached.conn;
}
