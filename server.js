import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Import routes
import userRoute from "./routes/user.route.js";
import gigRoute from "./routes/gig.route.js";
import orderRoute from "./routes/order.route.js";
import conversationRoute from "./routes/conversation.route.js";
import messageRoute from "./routes/message.route.js";
import reviewRoute from "./routes/review.route.js";
import authRoute from "./routes/auth.route.js";

// Load environment variables
dotenv.config();

// Create express app
const app = express();
mongoose.set("strictQuery", true);

// MongoDB connection
const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_URI || "mongodb://localhost:27017/fiverr");
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

// Middleware
app.use(cors({
  origin: [
    "https://fiver-frontend-two.vercel.app", // ✅ Production frontend
    "http://localhost:5173",                // ✅ Dev frontend
    "http://localhost:5174"                 // ✅ If your dev runs on 5174
  ],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);

// Global Error Handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  console.error(`❌ Error: ${message}`);
  return res.status(status).json({ success: false, status, message });
});

// Start server
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  connect();
  console.log(`🚀 Server is running on port ${PORT}`);
});
