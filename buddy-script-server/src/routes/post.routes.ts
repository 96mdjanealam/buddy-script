import { Router } from "express";
import { postController } from "../controllers/post.controller.js";
import { likeController } from "../controllers/like.controller.js";
import { commentController } from "../controllers/comment.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import {
  createPostSchema,
  updatePostSchema,
  toggleVisibilitySchema,
} from "../validators/post.validator.js";
import { createCommentSchema } from "../validators/comment.validator.js";
import { objectIdSchema, paginationSchema } from "../validators/common.validator.js";
import { z } from "zod";

const router = Router();

const postIdParamsSchema = z.object({
  postId: objectIdSchema,
});

// Post CRUD
router.post(
  "/",
  upload.single("image"),
  validate({ body: createPostSchema }),
  postController.createPost
);

router.patch(
  "/:postId",
  validate({ params: postIdParamsSchema }),
  upload.single("image"),
  validate({ body: updatePostSchema }),
  postController.updatePost
);

router.delete(
  "/:postId",
  validate({ params: postIdParamsSchema }),
  postController.deletePost
);

router.patch(
  "/:postId/visibility",
  validate({ params: postIdParamsSchema, body: toggleVisibilitySchema }),
  postController.toggleVisibility
);

// Like
router.post(
  "/:postId/like",
  validate({ params: postIdParamsSchema }),
  likeController.toggleLike
);

// Comments
router.post(
  "/:postId/comments",
  validate({ params: postIdParamsSchema, body: createCommentSchema }),
  commentController.addComment
);

router.get(
  "/:postId/comments",
  validate({ params: postIdParamsSchema, query: paginationSchema }),
  commentController.getComments
);

export default router;
