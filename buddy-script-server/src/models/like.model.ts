import mongoose, { Schema } from "mongoose";
import type { ILikeDocument } from "../types/index.js";

const likeSchema = new Schema<ILikeDocument>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: false,
      index: true,
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      required: false,
      index: true,
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

// Ensure that a like is either for a post or a comment, not both or neither
likeSchema.pre("validate", function () {
  if (this.post && this.comment) {
    this.invalidate("post", "A like cannot be associated with both a post and a comment.");
  }
  if (!this.post && !this.comment) {
    this.invalidate("post", "A like must be associated with either a post or a comment.");
  }
});

// Unique compound indexes prevent double-likes
likeSchema.index(
  { post: 1, user: 1 }, 
  { unique: true, partialFilterExpression: { post: { $exists: true } } }
);
likeSchema.index(
  { comment: 1, user: 1 }, 
  { unique: true, partialFilterExpression: { comment: { $exists: true } } }
);

export const Like = mongoose.model<ILikeDocument>("Like", likeSchema);

// trigger restart
