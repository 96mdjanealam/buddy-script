import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // For cookies if needed
});

// Response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error responses
    const message = error.response?.data?.message || "An unexpected error occurred";
    return Promise.reject({ ...error, message });
  }
);

export default apiClient;
