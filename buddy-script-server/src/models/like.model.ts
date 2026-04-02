import mongoose, { Schema } from "mongoose";
import type { ILikeDocument } from "../types/index.js";

const likeSchema = new Schema<ILikeDocument>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post reference is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index prevents double-likes
likeSchema.index({ post: 1, user: 1 }, { unique: true });

export const Like = mongoose.model<ILikeDocument>("Like", likeSchema);
