import apiClient from "@/lib/api-client";
import { User, ApiResponse, UpdateProfileData, ChangePasswordData, PaginationParams, PublicProfileResponse, NewFolksResponse } from "@/types/api";

export interface NewFolksParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const userService = {
  /**
   * Update the current user's profile information.
   * Supports updating name and profile image.
   */
  async updateProfile(data: UpdateProfileData): Promise<ApiResponse<User>> {
    const formData = new FormData();
    if (data.firstName) formData.append("firstName", data.firstName);
    if (data.lastName) formData.append("lastName", data.lastName);
    if (data.image) formData.append("image", data.image);

    const response = await apiClient.patch("/users/me", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Change the current user's password.
   */
  async changePassword(data: ChangePasswordData): Promise<ApiResponse> {
    const response = await apiClient.patch("/users/me/password", data);
    return response.data;
  },

  /**
   * Get public profile and paginated posts.
   */
  async getPublicProfile(
    userId: string,
    params?: PaginationParams
  ): Promise<ApiResponse<PublicProfileResponse>> {
    const response = await apiClient.get(`/users/${userId}`, { params });
    return response.data;
  },

  /**
   * Get latest users with pagination and optional name search.
   */
  async getLatestUsers(params?: NewFolksParams): Promise<ApiResponse<NewFolksResponse>> {
    const response = await apiClient.get("/users/latest", { params });
    return response.data;
  },
};
