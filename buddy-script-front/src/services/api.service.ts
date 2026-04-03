import api from "@/lib/api";

/**
 * These are simple, reusable functions for common API tasks.
 * They follow a clean, functional approach that is easy to understand.
 */

// 1. Fetch data from the endpoint
export const fetchData = async (endpoint: string) => {
  const response = await api.get(endpoint);
  return response.data;
};

// 2. Fetch a single item by ID
export const fetchById = async (endpoint: string, id: string | number) => {
  const response = await api.get(`${endpoint}/${id}`);
  return response.data;
};

// 3. Create a new item (POST)
export const postData = async (endpoint: string, data: any) => {
  const response = await api.post(endpoint, data);
  return response.data;
};

// 4. Update an existing item (PUT)
export const updateData = async (endpoint: string, id: string | number, data: any) => {
  const response = await api.put(`${endpoint}/${id}`, data);
  return response.data;
};

// 5. Delete an item
export const deleteData = async (endpoint: string, id: string | number) => {
  await api.delete(`${endpoint}/${id}`);
};
