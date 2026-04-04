import apiClient from "@/lib/api-client";
import { RegisterData, ApiResponse } from "@/types/api";

export const authService = {
  async register(data: RegisterData): Promise<ApiResponse> {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },
};
