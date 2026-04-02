import { Router } from "express";
import { feedController } from "../controllers/feed.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { paginationSchema } from "../validators/common.validator.js";

const router = Router();

router.get(
  "/",
  validate({ query: paginationSchema }),
  feedController.getFeed
);

export default router;
