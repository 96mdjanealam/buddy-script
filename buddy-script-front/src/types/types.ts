export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: {
    url: string;
    publicId: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  image?: File;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

export interface LoginData {
  email: string;
  password?: string;
}

export interface Post {
  _id: string;
  author: User;
  text?: string;
  image?: {
    url: string;
    publicId: string;
  };
  visibility: "public" | "private";
  likesCount: number;
  commentsCount: number;
  latestLikers?: User[];
  isLiked?: boolean; // Added for frontend state
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  post: string;
  author: User;
  text: string;
  parentComment: string | null;
  likesCount: number;
  latestLikers?: User[];
  isLiked?: boolean;
  replyCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Like {
  _id: string;
  post: string;
  user: string;
  createdAt: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalPosts?: number;
  totalComments?: number;
  totalReplies?: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface FeedResponse {
  posts: Post[];
  pagination: PaginationInfo;
}

export interface CommentsResponse {
  comments: Comment[];
  pagination: PaginationInfo;
}

export interface RepliesResponse {
  replies: Comment[];
  pagination: PaginationInfo;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PublicProfileResponse {
  user: User;
  posts: Post[];
  pagination: PaginationInfo;
}

export interface NewFolksUser {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage?: { url: string; publicId: string };
  createdAt: string;
}

export interface NewFolksPagination {
  page: number;
  limit: number;
  totalUsers: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface NewFolksResponse {
  users: NewFolksUser[];
  pagination: NewFolksPagination;
}


