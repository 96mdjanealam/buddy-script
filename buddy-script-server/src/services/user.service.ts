import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
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
    data: { name?: string },
    imageBuffer?: Buffer
  ) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound("User not found");
    }

    // Update name if provided
    if (data.name !== undefined) {
      user.name = data.name;
    }

    // Handle image upload
    if (imageBuffer) {
      // Delete old image from Cloudinary if exists
      if (user.profileImage?.publicId) {
        await deleteImageFromCloudinary(user.profileImage.publicId);
      }

      const uploaded = await uploadImageToCloudinary(
        imageBuffer,
        "buddy-script/profiles"
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
    newPassword: string
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
  async getPublicProfile(targetUserId: string, page: number, limit: number) {
    const user = await User.findById(targetUserId).select(
      "name email profileImage createdAt"
    );
    if (!user) {
      throw ApiError.notFound("User not found");
    }

    const skip = (page - 1) * limit;

    const [posts, totalPosts] = await Promise.all([
      Post.find({ author: targetUserId, visibility: "public" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "name email profileImage")
        .lean(),
      Post.countDocuments({ author: targetUserId, visibility: "public" }),
    ]);

    return {
      user,
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
