import { Router } from "express";
import { commentController } from "../controllers/comment.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { objectIdSchema, paginationSchema } from "../validators/common.validator.js";
import { z } from "zod";

const router = Router();

const commentIdParamsSchema = z.object({
  commentId: objectIdSchema,
});

// Get replies to a specific comment
router.get(
  "/:commentId/replies",
  validate({ params: commentIdParamsSchema, query: paginationSchema }),
  commentController.getReplies
);

// Delete a comment
router.delete(
  "/:commentId",
  validate({ params: commentIdParamsSchema }),
  commentController.deleteComment
);

export default router;
