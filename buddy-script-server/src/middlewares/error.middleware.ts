import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Default error values
  let statusCode = 500;
  let message = "Internal server error";
  let errors: string[] = [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err.name === "ValidationError") {
    // Mongoose validation error
    statusCode = 400;
    message = "Validation error";
    errors = [err.message];
  } else if (err.name === "CastError") {
    // Mongoose cast error (invalid ObjectId)
    statusCode = 400;
    message = "Invalid resource ID";
  } else if ((err as any).code === 11000) {
    // MongoDB duplicate key error
    statusCode = 409;
    message = "Duplicate field value";
    const field = Object.keys((err as any).keyValue || {})[0];
    if (field) {
      errors = [`${field} already exists`];
    }
  } else if (err.name === "MulterError") {
    statusCode = 400;
    message = (err as any).message || "File upload error";
  }

  // Log error in development
  if (env.NODE_ENV === "development") {
    console.error("❌ Error:", {
      statusCode,
      message,
      errors,
      stack: err.stack,
    });
    // Temporary file logging to help diagnose the Feed 500 error
    try {
      require("fs").appendFileSync(
        "backend-error.log", 
        new Date().toISOString() + " - " + message + "\n" + (err.stack || "") + "\n\n"
      );
    } catch(e) {}
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
