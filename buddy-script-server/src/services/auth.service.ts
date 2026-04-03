import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import type { IJwtPayload, IUserDocument } from "../types/index.js";

const generateToken = (user: IUserDocument): string => {
  const payload: IJwtPayload = {
    userId: user._id.toString(),
    email: user.email,
  };
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
};

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const authService = {
  /**
   * Register a new user and return user data.
   */
  async register(firstName: string, lastName: string, email: string, password: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict("User with this email already exists");
    }

    const user = await User.create({ firstName, lastName, email, password });

    const userResponse = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
    };

    return { user: userResponse };
  },

  /**
   * Login with email and password, return token + user data.
   */
  async login(email: string, password: string) {
    // Explicitly select password since it's excluded by default
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const token = generateToken(user);

    const userResponse = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
    };

    return { user: userResponse, token, cookieOptions: COOKIE_OPTIONS };
  },

  /**
   * Cookie options for clearing the token on logout.
   */
  getClearCookieOptions() {
    return {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict" as const,
    };
  },
};
