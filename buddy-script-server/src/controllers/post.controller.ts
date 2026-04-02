import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { postService } from "../services/post.service.js";

export const postController = {
  /**
   * POST /api/posts
   * Supports multipart form data (text + optional image file).
   */
  createPost: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();

    const imageBuffer = req.file?.buffer;
    const post = await postService.createPost(
      req.user.userId,
      {
        text: req.body.text,
        visibility: req.body.visibility,
      },
      imageBuffer
    );

    return ApiResponse.created(res, "Post created successfully", post);
  }),

  /**
   * PATCH /api/posts/:postId
   * Supports multipart form data (text + optional image file).
   */
  updatePost: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();

    const postId = req.params.postId as string;
    const imageBuffer = req.file?.buffer;
    const post = await postService.updatePost(
      postId,
      req.user.userId,
      {
        text: req.body.text,
        visibility: req.body.visibility,
      },
      imageBuffer
    );

    return ApiResponse.success(res, "Post updated successfully", post);
  }),

  /**
   * DELETE /api/posts/:postId
   */
  deletePost: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();

    const postId = req.params.postId as string;
    const result = await postService.deletePost(postId, req.user.userId);

    return ApiResponse.success(res, result.message, null);
  }),

  /**
   * PATCH /api/posts/:postId/visibility
   */
  toggleVisibility: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();

    const postId = req.params.postId as string;
    const { visibility } = req.body;
    const post = await postService.toggleVisibility(
      postId,
      req.user.userId,
      visibility
    );

    return ApiResponse.success(res, "Post visibility updated", post);
  }),
};
