import { Post } from "../models/post.model.js";
import { likeService } from "./like.service.js";

export const feedService = {
  /**
   * Get the global public feed:
   * - Only public posts from all users
   * Sorted by newest first, paginated.
   */
  async getFeed(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const filter = {
      visibility: "public",
    };

    const [posts, totalPosts] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "firstName lastName email profileImage")
        .lean(),
      Post.countDocuments(filter),
    ]);

    // Enrich posts with latest 3 likers
    const postsWithLikers = await Promise.all(
      posts.map(async (post: any) => {
        const latestLikers = await likeService.getLatestLikers(post._id);
        const isLiked = userId ? await likeService.hasUserLiked(post._id, undefined, userId) : false;
        return { ...post, latestLikers, isLiked };
      })
    );

    return {
      posts: postsWithLikers,
      pagination: {
        page,
        limit,
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
        hasNextPage: page * limit < totalPosts,
      },
    };
  },
};
