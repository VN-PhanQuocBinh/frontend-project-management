import axiosClient from "./axios-client";
import type { Comment } from "@/types/comment";

export const createComment = async (commentData: {
  content: string;
  taskId: string;
  userId: string;
}): Promise<Comment> => {
  const response = await axiosClient.post("/comments", commentData);
  return response as unknown as Comment;
};

export const getCommentsByTaskId = async (taskId: string): Promise<Comment[]> => {
  const response = await axiosClient.get(`/comments/task/${taskId}`);
  return response as unknown as Comment[];
};

export const updateComment = async (commentId: string, content: string): Promise<Comment> => {
  const response = await axiosClient.put(`/comments/${commentId}`, { content });
  return response as unknown as Comment;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  await axiosClient.delete(`/comments/${commentId}`);
};
