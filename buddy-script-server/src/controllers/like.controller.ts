import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { likeService } from "../services/like.service.js";

export const likeController = {
  /**
   * POST /api/posts/:postId/like
   */
  toggleLike: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();

    const postId = req.params.postId as string;
    const result = await likeService.toggleLike(postId, req.user.userId);

    const message = result.liked ? "Post liked" : "Post unliked";
    return ApiResponse.success(res, message, result);
  }),
};
