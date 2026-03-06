import type { User } from "@/types/project";
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

// Assignee APIs
export const addAssignee = async (data: {
  userId: string;
  taskId: string;
  projectId: string;
}): Promise<User> => {
  const response = await axiosClient.post('/task-assignees', data);
  return response.data.user;
}
