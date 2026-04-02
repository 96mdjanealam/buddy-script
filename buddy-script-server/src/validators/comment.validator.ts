import { z } from "zod";
import { objectIdSchema } from "./common.validator.js";

export const createCommentSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Comment text cannot be empty")
    .max(2000, "Comment cannot exceed 2000 characters"),
  parentCommentId: objectIdSchema.optional(),
});

export const deleteCommentParamsSchema = z.object({
  commentId: objectIdSchema,
});
