import apiClient from "@/lib/api-client";
import {
  ApiResponse,
  Post,
  User,
  Comment,
  FeedResponse,
  CommentsResponse,
  RepliesResponse,
  PaginationParams,
} from "@/types/types";

export const postService = {
  async getFeed(params: PaginationParams = {}): Promise<ApiResponse<FeedResponse>> {
    const response = await apiClient.get("/feed", { params });
    return response.data;
  },

  async createPost(formData: FormData): Promise<ApiResponse<Post>> {
    const response = await apiClient.post("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async toggleLike(postId: string): Promise<ApiResponse<{ liked: boolean; likesCount: number; latestLikers: User[] }>> {
    const response = await apiClient.post(`/posts/${postId}/like`);
    return response.data;
  },

  async addComment(
    postId: string,
    text: string,
    parentCommentId?: string
  ): Promise<ApiResponse<Comment>> {
    const response = await apiClient.post(`/posts/${postId}/comments`, {
      text,
      parentCommentId,
    });
    return response.data;
  },

  async getComments(
    postId: string,
    params: PaginationParams = {}
  ): Promise<ApiResponse<CommentsResponse>> {
    const response = await apiClient.get(`/posts/${postId}/comments`, { params });
    return response.data;
  },

  async getReplies(
    commentId: string,
    params: PaginationParams = {}
  ): Promise<ApiResponse<RepliesResponse>> {
    const response = await apiClient.get(`/comments/${commentId}/replies`, { params });
    return response.data;
  },

  async deletePost(postId: string): Promise<ApiResponse> {
    const response = await apiClient.delete(`/posts/${postId}`);
    return response.data;
  },

  async toggleCommentLike(commentId: string): Promise<ApiResponse<{ liked: boolean; likesCount: number; latestLikers: User[] }>> {
    const response = await apiClient.post(`/comments/${commentId}/like`);
    return response.data;
  },

  async deleteComment(commentId: string): Promise<ApiResponse<{ deletedCount: number }>> {
    const response = await apiClient.delete(`/comments/${commentId}`);
    return response.data;
  },

  async toggleVisibility(postId: string, visibility: "public" | "private"): Promise<ApiResponse<Post>> {
    const response = await apiClient.patch(`/posts/${postId}/visibility`, { visibility });
    return response.data;
  },
};


