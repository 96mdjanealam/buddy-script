import { Like } from "../models/like.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";

export const likeService = {
  /**
   * Toggle like on a post. If already liked, unlike it; otherwise, like it.
   * Uses atomic $inc to keep likesCount in sync.
   */
  async toggleLike(postId: string, userId: string) {
    const post = await Post.findById(postId);
    if (!post) {
      throw ApiError.notFound("Post not found");
    }

    const existingLike = await Like.findOne({ post: postId, user: userId });

    if (existingLike) {
      // Unlike
      await existingLike.deleteOne();
      await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });

      return { liked: false, likesCount: post.likesCount - 1 };
    } else {
      // Like
      await Like.create({ post: postId, user: userId });
      await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });

      return { liked: true, likesCount: post.likesCount + 1 };
    }
  },

  /**
   * Check if a user has liked a specific post.
   */
  async hasUserLiked(postId: string, userId: string): Promise<boolean> {
    const like = await Like.findOne({ post: postId, user: userId }).lean();
    return !!like;
  },
};
