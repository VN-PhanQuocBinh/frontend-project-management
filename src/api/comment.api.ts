import axiosClient from "./axios-client";
import type { Comment } from "@/types/comment";
import type { ApiResponse } from "@/types/api-response";

export const createComment = async (commentData: {
  content: string;
  taskId: string;
  userId: string;
}): Promise<Comment> => {
  const response = await axiosClient.post("/comments", commentData) as unknown as ApiResponse<Comment>;
  return response.data;
};

export const getCommentsByTaskId = async (taskId: string): Promise<Comment[]> => {
  const response = await axiosClient.get(`/comments/task/${taskId}`) as unknown as ApiResponse<Comment[]>;
  return response.data;
};

export const updateComment = async (commentId: string, content: string): Promise<Comment> => {
  const response = await axiosClient.put(`/comments/${commentId}`, { content }) as unknown as ApiResponse<Comment>;
  return response.data;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  await axiosClient.delete(`/comments/${commentId}`);
};
