import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "../validators/user.validator.js";
import { objectIdSchema, paginationSchema } from "../validators/common.validator.js";
import { z } from "zod";

const router = Router();

const userIdParamsSchema = z.object({
  userId: objectIdSchema,
});

// Own profile
router.get("/me", userController.getProfile);

router.patch(
  "/me",
  upload.single("image"),
  validate({ body: updateProfileSchema }),
  userController.updateProfile
);

router.patch(
  "/me/password",
  validate({ body: changePasswordSchema }),
  userController.changePassword
);

// List latest 10 users
router.get("/latest", userController.getLatestUsers);

// Public profile
router.get(
  "/:userId",
  validate({ params: userIdParamsSchema, query: paginationSchema }),
  userController.getPublicProfile
);

export default router;
