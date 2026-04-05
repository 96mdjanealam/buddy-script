import apiClient from "@/lib/api-client";
import { User, ApiResponse, UpdateProfileData, ChangePasswordData } from "@/types/api";

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
};
