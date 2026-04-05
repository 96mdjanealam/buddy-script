import { Router } from "express";
import { likeController } from "../controllers/like.controller.js";
import { commentController } from "../controllers/comment.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { objectIdSchema, paginationSchema } from "../validators/common.validator.js";
import { z } from "zod";

const router = Router();

const commentIdParamsSchema = z.object({
  commentId: objectIdSchema,
});

// Get Replies
router.get(
  "/:commentId/replies",
  validate({ params: commentIdParamsSchema, query: paginationSchema }),
  commentController.getReplies
);

// Delete Comment
router.delete(
  "/:commentId",
  authenticate,
  validate({ params: commentIdParamsSchema }),
  commentController.deleteComment
);

// Like
router.post(
  "/:commentId/like",
  authenticate,
  validate({ params: commentIdParamsSchema }),
  likeController.toggleCommentLike
);

export default router;
