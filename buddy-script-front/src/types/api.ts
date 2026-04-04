export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}
