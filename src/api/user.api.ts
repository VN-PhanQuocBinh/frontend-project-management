import axiosClient from "./axios-client";
import type { User } from "@/types/project";

export const getUserById = async (userId: string) => {
  const response = await axiosClient.get(`/users/${userId}`);
  return response.data;
};

export const updateUser = async (userId: string, data: Partial<User>) => {
  const response = await axiosClient.put(`/users/${userId}`, data);
  return response.data;
};
