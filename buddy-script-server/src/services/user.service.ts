import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { likeService } from "./like.service.js";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../utils/cloudinary.utils.js";

export const userService = {
  /**
   * Get the authenticated user's own profile.
   */
  async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound("User not found");
    }
    return user;
  },

  /**
   * Update authenticated user's profile (name and/or image).
   */
  async updateProfile(
    userId: string,
    data: { firstName?: string; lastName?: string },
    imageBuffer?: Buffer,
  ) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound("User not found");
    }

    // Update firstName and lastName if provided
    if (data.firstName !== undefined) {
      user.firstName = data.firstName;
    }
    if (data.lastName !== undefined) {
      user.lastName = data.lastName;
    }

    // Handle image upload
    if (imageBuffer) {
      // Delete old image from Cloudinary if exists
      if (user.profileImage?.publicId) {
        await deleteImageFromCloudinary(user.profileImage.publicId);
      }

      const uploaded = await uploadImageToCloudinary(
        imageBuffer,
        "buddy-script/profiles",
      );
      user.profileImage = {
        url: uploaded.url,
        publicId: uploaded.publicId,
      };
    }

    await user.save();
    return user;
  },

  /**
   * Change authenticated user's password.
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await User.findById(userId).select("+password");
    if (!user) {
      throw ApiError.notFound("User not found");
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw ApiError.unauthorized("Current password is incorrect");
    }

    user.password = newPassword;
    await user.save(); // pre-save hook will hash it
    return { message: "Password changed successfully" };
  },

  /**
   * Get another user's public profile with their public posts (paginated).
   */
  async getPublicProfile(
    targetUserId: string,
    page: number,
    limit: number,
    loggedInUserId?: string,
  ) {
    const user = await User.findById(targetUserId).select(
      "firstName lastName email profileImage createdAt",
    );
    if (!user) {
      throw ApiError.notFound("User not found");
    }

    const skip = (page - 1) * limit;

    // If the requesting user is the owner, show all posts; otherwise, show only public posts
    const postFilter = {
      author: targetUserId,
      ...(loggedInUserId !== targetUserId && { visibility: "public" }),
    };

    const [posts, totalPosts] = await Promise.all([
      Post.find(postFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "firstName lastName email profileImage")
        .lean(),
      Post.countDocuments(postFilter),
    ]);

    // Enrich posts with latest 3 likers
    const postsWithLikers = await Promise.all(
      posts.map(async (post: any) => {
        const latestLikers = await likeService.getLatestLikers(post._id);
        const isLiked = loggedInUserId ? await likeService.hasUserLiked(post._id, undefined, loggedInUserId) : false;
        return { ...post, latestLikers, isLiked };
      })
    );

    return {
      user,
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

  /**
   * Get the latest registered users with pagination and optional name search.
   */
  async getLatestUsers(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { firstName: { $regex: regex } },
        { lastName: { $regex: regex } },
      ];
    }

    const [users, totalUsers] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("firstName lastName profileImage createdAt")
        .lean(),
      User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    return {
      users,
      pagination: {
        page,
        limit,
        totalUsers,
        totalPages,
        hasNextPage: page < totalPages,
      },
    };
  },
};
