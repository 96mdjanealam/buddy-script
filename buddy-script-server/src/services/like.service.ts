import { Like } from "../models/like.model.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";

export const likeService = {
  /**
   * Get the 3 most recent likers for a post or a comment.
   */
  async getLatestLikers(postId?: string, commentId?: string) {
    const filter = postId ? { post: postId } : { comment: commentId };
    const likes = await Like.find(filter)
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("user", "firstName lastName profileImage")
      .lean();

    return likes.map((like: any) => like.user);
  },

  /**
   * Toggle like on a post or a comment.
   */
  async toggleLike(postId: string | undefined, commentId: string | undefined, userId: string) {
    let targetModel: any;
    let targetId: string;
    let filter: any;

    if (postId) {
      targetModel = Post;
      targetId = postId;
      filter = { post: postId, user: userId };
    } else if (commentId) {
      targetModel = Comment;
      targetId = commentId;
      filter = { comment: commentId, user: userId };
    } else {
      throw ApiError.badRequest("Post ID or Comment ID is required");
    }

    const target = await targetModel.findById(targetId);
    if (!target) {
      throw ApiError.notFound(`${postId ? "Post" : "Comment"} not found`);
    }

    const existingLike = await Like.findOne(filter);

    if (existingLike) {
      // Unlike
      await existingLike.deleteOne();
      await targetModel.findByIdAndUpdate(targetId, { $inc: { likesCount: -1 } });
    } else {
      // Like
      await Like.create({ ...filter });
      await targetModel.findByIdAndUpdate(targetId, { $inc: { likesCount: 1 } });
    }

    const [updatedTarget, latestLikers] = await Promise.all([
      targetModel.findById(targetId).select("likesCount").lean(),
      this.getLatestLikers(postId, commentId),
    ]);

    return {
      liked: !existingLike,
      likesCount: updatedTarget?.likesCount || 0,
      latestLikers,
    };
  },

  /**
   * Check if a user has liked a specific post or comment.
   */
  async hasUserLiked(postId: string | undefined, commentId: string | undefined, userId: string): Promise<boolean> {
    const filter = postId ? { post: postId, user: userId } : { comment: commentId, user: userId };
    const like = await Like.findOne(filter).lean();
    return !!like;
  },
};
