import mongoose, { Schema } from "mongoose";
import type { IPostDocument } from "../types/index.js";

const postSchema = new Schema<IPostDocument>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
      index: true,
    },
    text: {
      type: String,
      trim: true,
      maxlength: [5000, "Text cannot exceed 5000 characters"],
    },
    image: {
      url: { type: String },
      publicId: { type: String },
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Custom validation: at least text or image is required
postSchema.pre("validate", function () {
  if (!this.text && (!this.image || !this.image.url)) {
    this.invalidate("text", "Post must have at least text or an image");
  }
});

// Compound indexes for efficient querying
postSchema.index({ visibility: 1, createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ author: 1, visibility: 1, createdAt: -1 });

export const Post = mongoose.model<IPostDocument>("Post", postSchema);
