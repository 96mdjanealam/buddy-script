import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { feedService } from "../services/feed.service.js";

export const feedController = {
  /**
   * GET /api/feed?page=1&limit=20
   */
  getFeed: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await feedService.getFeed(req.user.userId, page, limit);

    return ApiResponse.success(res, "Feed retrieved successfully", result);
  }),
};
