import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";

export const commentService = {
  /**
   * Add a comment (or reply) to a post.
   */
  async addComment(
    postId: string,
    userId: string,
    text: string,
    parentCommentId?: string
  ) {
    const post = await Post.findById(postId);
    if (!post) {
      throw ApiError.notFound("Post not found");
    }

    // If it's a reply, validate the parent comment exists and belongs to the same post
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        throw ApiError.notFound("Parent comment not found");
      }
      if (parentComment.post.toString() !== postId) {
        throw ApiError.badRequest(
          "Parent comment does not belong to this post"
        );
      }
    }

    const comment = await Comment.create({
      post: postId,
      author: userId,
      text,
      parentComment: parentCommentId || null,
    });

    // Increment comments count on the post
    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    await comment.populate("author", "name email profileImage");

    return comment;
  },

  /**
   * Get top-level comments for a post (where parentComment is null), paginated.
   */
  async getComments(postId: string, page: number, limit: number) {
    const post = await Post.findById(postId);
    if (!post) {
      throw ApiError.notFound("Post not found");
    }

    const skip = (page - 1) * limit;

    const [comments, totalComments] = await Promise.all([
      Comment.find({ post: postId, parentComment: null })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "name email profileImage")
        .lean(),
      Comment.countDocuments({ post: postId, parentComment: null }),
    ]);

    // For each top-level comment, get the reply count
    const commentsWithReplyCount = await Promise.all(
      comments.map(async (comment) => {
        const replyCount = await Comment.countDocuments({
          parentComment: comment._id,
        });
        return { ...comment, replyCount };
      })
    );

    return {
      comments: commentsWithReplyCount,
      pagination: {
        page,
        limit,
        totalComments,
        totalPages: Math.ceil(totalComments / limit),
        hasNextPage: page * limit < totalComments,
      },
    };
  },

  /**
   * Get replies to a specific comment, paginated.
   */
  async getReplies(commentId: string, page: number, limit: number) {
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      throw ApiError.notFound("Comment not found");
    }

    const skip = (page - 1) * limit;

    const [replies, totalReplies] = await Promise.all([
      Comment.find({ parentComment: commentId })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "name email profileImage")
        .lean(),
      Comment.countDocuments({ parentComment: commentId }),
    ]);

    return {
      replies,
      pagination: {
        page,
        limit,
        totalReplies,
        totalPages: Math.ceil(totalReplies / limit),
        hasNextPage: page * limit < totalReplies,
      },
    };
  },

  /**
   * Delete a comment (ownership verified). Decrements post comment count.
   * Also deletes all nested replies recursively.
   */
  async deleteComment(commentId: string, userId: string) {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw ApiError.notFound("Comment not found");
    }

    if (comment.author.toString() !== userId) {
      throw ApiError.forbidden("You can only delete your own comments");
    }

    // Count this comment + all nested replies for decrementing
    const replyCount = await Comment.countDocuments({
      parentComment: commentId,
    });
    const totalToDelete = 1 + replyCount;

    // Delete the comment and all its replies
    await Promise.all([
      Comment.deleteMany({ parentComment: commentId }),
      comment.deleteOne(),
    ]);

    // Decrement comments count on the post
    await Post.findByIdAndUpdate(comment.post, {
      $inc: { commentsCount: -totalToDelete },
    });

    return { message: "Comment deleted successfully" };
  },
};
