import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import type { IJwtPayload } from "../types/index.js";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  // Try to get token from cookie first, then from Authorization header
  let token: string | undefined;

  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw ApiError.unauthorized("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as IJwtPayload;
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };
    next();
  } catch {
    throw ApiError.unauthorized("Invalid or expired token.");
  }
};
