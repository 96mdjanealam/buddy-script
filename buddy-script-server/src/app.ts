import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://buddy-script-front.vercel.app"],
    credentials: true,
  }),
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cookie parsing
app.use(cookieParser());

// Health check
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "BuddyScript API is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api", routes);

// 404 handler for undefined routes
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: "Route not found",
  });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
