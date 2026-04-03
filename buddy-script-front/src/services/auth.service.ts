import { postData } from "./api.service";
import { RegisterFormValues } from "@/schemas/auth.schema";

/**
 * These are simple authentication functions for the registration and login.
 */

// 1. Register a new user
export const registerUser = async (data: RegisterFormValues) => {
  return await postData("/auth/register", {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
  });
};

// 2. Login a user
export const loginUser = async (data: any) => {
  return await postData("/auth/login", data);
};

// 3. Logout a user
export const logoutUser = async () => {
  return await postData("/auth/logout", {});
};
