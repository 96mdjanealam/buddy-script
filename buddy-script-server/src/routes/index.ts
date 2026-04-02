import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";

import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import postRoutes from "./post.routes.js";
import feedRoutes from "./feed.routes.js";
import commentRoutes from "./comment.routes.js";

const router = Router();

// Public routes (no auth required)
router.use("/auth", authRoutes);

// Protected routes (auth required)
router.use("/users", authenticate, userRoutes);
router.use("/posts", authenticate, postRoutes);
router.use("/feed", authenticate, feedRoutes);
router.use("/comments", authenticate, commentRoutes);

export default router;
