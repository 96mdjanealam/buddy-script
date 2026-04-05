import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { likeService } from "./like.service.js";
import { Like } from "../models/like.model.js";

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

    await comment.populate("author", "firstName lastName email profileImage");

    return comment;
  },

  /**
   * Get top-level comments for a post (where parentComment is null), paginated.
   */
  async getComments(postId: string, page: number, limit: number, userId?: string) {
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
        .populate("author", "firstName lastName email profileImage")
        .lean(),
      Comment.countDocuments({ post: postId, parentComment: null }),
    ]);

    // For each top-level comment, get the reply count, latest likers, and isLiked state
    const commentsWithEnrichment = await Promise.all(
      comments.map(async (comment: any) => {
        const [replyCount, latestLikers, isLiked] = await Promise.all([
          Comment.countDocuments({ parentComment: comment._id }),
          likeService.getLatestLikers(undefined, comment._id),
          userId ? likeService.hasUserLiked(undefined, comment._id, userId) : false,
        ]);
        return { ...comment, replyCount, latestLikers, isLiked };
      })
    );

    return {
      comments: commentsWithEnrichment,
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
  async getReplies(commentId: string, page: number, limit: number, userId?: string) {
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
        .populate("author", "firstName lastName email profileImage")
        .lean(),
      Comment.countDocuments({ parentComment: commentId }),
    ]);

    // Enrich replies with latest likers and isLiked state
    const enrichedReplies = await Promise.all(
      replies.map(async (reply: any) => {
        const [latestLikers, isLiked] = await Promise.all([
          likeService.getLatestLikers(undefined, reply._id),
          userId ? likeService.hasUserLiked(undefined, reply._id, userId) : false,
        ]);
        return { ...reply, latestLikers, isLiked };
      })
    );

    return {
      replies: enrichedReplies,
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
   * Internal helper to find all descendant IDs of a comment recursively.
   */
  async getAllDescendantIds(parentCommentId: string): Promise<string[]> {
    const descendants: string[] = [];
    const queue = [parentCommentId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const children = await Comment.find({ parentComment: currentId }).select("_id").lean();
      
      const childIds = children.map(c => c._id.toString());
      descendants.push(...childIds);
      queue.push(...childIds);
    }

    return descendants;
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

    // Find all descendant IDs recursively
    const descendantIds = await this.getAllDescendantIds(commentId);
    const allIdsToDelete = [commentId, ...descendantIds];
    const totalToDelete = allIdsToDelete.length;

    // Delete all comments and their associated likes
    await Promise.all([
      Comment.deleteMany({ _id: { $in: allIdsToDelete } }),
      Like.deleteMany({ comment: { $in: allIdsToDelete } }),
    ]);

    // Decrement comments count on the post
    await Post.findByIdAndUpdate(comment.post, {
      $inc: { commentsCount: -totalToDelete },
    });

    return { message: "Comment deleted successfully", deletedCount: totalToDelete };
  },
};
