import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL
  ? `${process.env.NEXT_PUBLIC_BASE_API_URL}/api`
  : "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || "An unexpected error occurred";
    return Promise.reject({ ...error, message });
  },
);

export default apiClient;


