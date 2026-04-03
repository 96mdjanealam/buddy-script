import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { authService } from "../services/auth.service.js";

export const authController = {
  /**
   * POST /api/auth/register
   */
  register: asyncHandler(async (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body;
    const { user, token, cookieOptions } = await authService.register(
      firstName,
      lastName,
      email,
      password,
    );

    res.cookie("accessToken", token, cookieOptions);

    return ApiResponse.created(res, "User registered successfully", {
      user,
      token,
    });
  }),

  /**
   * POST /api/auth/login
   */
  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { user, token, cookieOptions } = await authService.login(
      email,
      password
    );

    res.cookie("accessToken", token, cookieOptions);

    return ApiResponse.success(res, "Login successful", {
      user,
      token,
    });
  }),

  /**
   * POST /api/auth/logout
   */
  logout: asyncHandler(async (_req: Request, res: Response) => {
    const clearOptions = authService.getClearCookieOptions();
    res.clearCookie("accessToken", clearOptions);

    return ApiResponse.success(res, "Logged out successfully", null);
  }),
};
