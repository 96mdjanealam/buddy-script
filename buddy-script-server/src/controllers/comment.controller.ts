import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { commentService } from "../services/comment.service.js";

export const commentController = {
  /**
   * POST /api/posts/:postId/comments
   */
  addComment: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();

    const postId = req.params.postId as string;
    const { text, parentCommentId } = req.body;

    const comment = await commentService.addComment(
      postId,
      req.user.userId,
      text,
      parentCommentId
    );

    return ApiResponse.created(res, "Comment added successfully", comment);
  }),

  /**
   * GET /api/posts/:postId/comments?page=1&limit=20
   */
  getComments: asyncHandler(async (req: Request, res: Response) => {
    const postId = req.params.postId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await commentService.getComments(postId, page, limit, req.user?.userId);

    return ApiResponse.success(res, "Comments retrieved successfully", result);
  }),

  /**
   * GET /api/comments/:commentId/replies?page=1&limit=20
   */
  getReplies: asyncHandler(async (req: Request, res: Response) => {
    const commentId = req.params.commentId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await commentService.getReplies(commentId, page, limit, req.user?.userId);

    return ApiResponse.success(res, "Replies retrieved successfully", result);
  }),

  /**
   * DELETE /api/comments/:commentId
   */
  deleteComment: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();

    const commentId = req.params.commentId as string;
    const result = await commentService.deleteComment(
      commentId,
      req.user.userId
    );

    return ApiResponse.success(res, result.message, null);
  }),
};
