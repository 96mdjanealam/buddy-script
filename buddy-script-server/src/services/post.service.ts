import { Post } from "../models/post.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../utils/cloudinary.utils.js";
import type { PostVisibility } from "../types/index.js";

export const postService = {
  /**
   * Create a new post with optional text and/or image.
   */
  async createPost(
    authorId: string,
    data: { text?: string; visibility?: PostVisibility },
    imageBuffer?: Buffer
  ) {
    let image: { url: string; publicId: string } | undefined;

    if (imageBuffer) {
      image = await uploadImageToCloudinary(
        imageBuffer,
        "buddy-script/posts"
      );
    }

    // Validate that at least text or image is provided
    if (!data.text && !image) {
      throw ApiError.badRequest("Post must have at least text or an image");
    }

    const post = await Post.create({
      author: authorId,
      text: data.text,
      image,
      visibility: data.visibility || "public",
    });

    // Populate author info before returning
    await post.populate("author", "name email profileImage");

    return post;
  },

  /**
   * Update an existing post (ownership verified).
   */
  async updatePost(
    postId: string,
    userId: string,
    data: { text?: string; visibility?: PostVisibility },
    imageBuffer?: Buffer
  ) {
    const post = await Post.findById(postId);
    if (!post) {
      throw ApiError.notFound("Post not found");
    }

    if (post.author.toString() !== userId) {
      throw ApiError.forbidden("You can only edit your own posts");
    }

    // Update text if provided
    if (data.text !== undefined) {
      post.text = data.text;
    }

    // Update visibility if provided
    if (data.visibility !== undefined) {
      post.visibility = data.visibility;
    }

    // Handle image update
    if (imageBuffer) {
      // Delete old image from Cloudinary if exists
      if (post.image?.publicId) {
        await deleteImageFromCloudinary(post.image.publicId);
      }

      const uploaded = await uploadImageToCloudinary(
        imageBuffer,
        "buddy-script/posts"
      );
      post.image = {
        url: uploaded.url,
        publicId: uploaded.publicId,
      };
    }

    await post.save();
    await post.populate("author", "name email profileImage");

    return post;
  },

  /**
   * Delete a post (ownership verified). Also cleans up related likes, comments, and Cloudinary image.
   */
  async deletePost(postId: string, userId: string) {
    const post = await Post.findById(postId);
    if (!post) {
      throw ApiError.notFound("Post not found");
    }

    if (post.author.toString() !== userId) {
      throw ApiError.forbidden("You can only delete your own posts");
    }

    // Delete image from Cloudinary if exists
    if (post.image?.publicId) {
      await deleteImageFromCloudinary(post.image.publicId);
    }

    // Clean up related data
    await Promise.all([
      Like.deleteMany({ post: postId }),
      Comment.deleteMany({ post: postId }),
      post.deleteOne(),
    ]);

    return { message: "Post deleted successfully" };
  },

  /**
   * Toggle post visibility (ownership verified).
   */
  async toggleVisibility(
    postId: string,
    userId: string,
    visibility: PostVisibility
  ) {
    const post = await Post.findById(postId);
    if (!post) {
      throw ApiError.notFound("Post not found");
    }

    if (post.author.toString() !== userId) {
      throw ApiError.forbidden("You can only modify your own posts");
    }

    post.visibility = visibility;
    await post.save();
    await post.populate("author", "name email profileImage");

    return post;
  },

  /**
   * Get a single post by ID (used internally).
   */
  async getPostById(postId: string) {
    const post = await Post.findById(postId)
      .populate("author", "name email profileImage")
      .lean();
    if (!post) {
      throw ApiError.notFound("Post not found");
    }
    return post;
  },
};
