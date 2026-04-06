import apiClient from "@/lib/api-client";
import { RegisterData, LoginData, ApiResponse, LoginResponse, User } from "@/types/types";

export const authService = {
  async register(data: RegisterData): Promise<ApiResponse> {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  async login(data: LoginData): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },

  async logout(): Promise<ApiResponse> {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },

  async getMe(): Promise<ApiResponse<User>> {
    const response = await apiClient.get("/users/me");
    return response.data;
  },
};


