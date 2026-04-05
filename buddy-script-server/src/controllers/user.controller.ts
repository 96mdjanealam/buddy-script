import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { userService } from "../services/user.service.js";

export const userController = {
  /**
   * GET /api/users/me
   */
  getProfile: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();

    const user = await userService.getProfile(req.user.userId);

    return ApiResponse.success(res, "Profile retrieved successfully", user);
  }),

  /**
   * PATCH /api/users/me
   * Supports multipart form data (name + optional image file).
   */
  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();

    const imageBuffer = req.file?.buffer;
    const user = await userService.updateProfile(
      req.user.userId,
      { firstName: req.body.firstName, lastName: req.body.lastName },
      imageBuffer,
    );

    return ApiResponse.success(res, "Profile updated successfully", user);
  }),

  /**
   * PATCH /api/users/me/password
   */
  changePassword: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();

    const { currentPassword, newPassword } = req.body;
    const result = await userService.changePassword(
      req.user.userId,
      currentPassword,
      newPassword,
    );

    return ApiResponse.success(res, result.message, null);
  }),

  /**
   * GET /api/users/:userId
   * Public profile with paginated public posts.
   */
  getPublicProfile: asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const loggedInUserId = req.user?.userId;

    const result = await userService.getPublicProfile(
      userId as string,
      page,
      limit,
      loggedInUserId,
    );

    return ApiResponse.success(
      res,
      "Public profile retrieved successfully",
      result,
    );
  }),

  /**
   * GET /api/users/latest
   * Paginated list of most recently registered users, searchable by name.
   */
  getLatestUsers: asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const search = (req.query.search as string) || undefined;

    const result = await userService.getLatestUsers(page, limit, search);

    return ApiResponse.success(
      res,
      "Latest registered users retrieved successfully",
      result,
    );
  }),
};
