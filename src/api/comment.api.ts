import axiosClient from "./axios-client";

export const createComment = async (commentData: {
  content: string;
  taskId: string;
  userId: string;
}) => {
  const response = await axiosClient.post("/comments", commentData);
  return response.data;
};

export const getCommentsByTaskId = async (taskId: string) => {
  const response = await axiosClient.get(`/comments/task/${taskId}`);
  return response.data;
};

export const updateComment = async (commentId: string, content: string) => {
  const response = await axiosClient.put(`/comments/${commentId}`, { content });
  return response.data;
};

export const deleteComment = async (commentId: string) => {
  const response = await axiosClient.delete(`/comments/${commentId}`);
  return response.data;
};
