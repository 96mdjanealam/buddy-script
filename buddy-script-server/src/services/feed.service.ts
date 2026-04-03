import { Post } from "../models/post.model.js";

export const feedService = {
  /**
   * Get the feed for an authenticated user:
   * - All public posts from all users
   * - All of the user's own posts (including private)
   * Sorted by newest first, paginated.
   */
  async getFeed(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const filter = {
      $or: [{ visibility: "public" }, { author: userId }],
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

    return {
      posts,
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
