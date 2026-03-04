import axiosClient from "./axios-client";
import { type Task } from "@/types/task";

export const getTaskById = async (taskId: string) => {
  const response = await axiosClient.get(`/tasks/${taskId}`);
  return response.data;
};

export const updateTask = async (taskId: string, data: Partial<Task>) => {
  const response = await axiosClient.put(`/tasks/${taskId}`, data);
  return response.data;
};
