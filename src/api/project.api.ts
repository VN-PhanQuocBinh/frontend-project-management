/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Card, Column, Project, User } from "@/types/project";
import type { UniqueIdentifier } from "@dnd-kit/core";
import axiosClient from "./axios-client";
import { useProjectStore } from "@/stores/project-store";
import type { ApiResponse } from "@/types/api-response";

// Project
export const createProjectAPI = async (projectData: { name: string }) => {
  const res = await axiosClient.post("/projects", projectData);
  const newProject = res.data;

  const currentProjects = useProjectStore.getState().projects;
  currentProjects.push(newProject);

  useProjectStore.getState().setProjects(currentProjects);
};

export const updateProjectDetailsAPI = async (
  projectId: UniqueIdentifier,
  updateData: Project,
) => {
  // Placeholder for API call to update project details
  console.log("Gọi API update project details trong file project.api.ts");
  axiosClient.put(`/projects/${projectId}`, updateData);
};

export const moveCardToDifferentColumnAPI = async (updateData: {
  currentCardId: UniqueIdentifier | undefined;
  prevColumnId: UniqueIdentifier | undefined;
  prevtaskOrderIds: UniqueIdentifier[] | undefined;
  nextColumnId: UniqueIdentifier | undefined;
  nexttaskOrderIds: UniqueIdentifier[] | undefined;
}) => {
  // Placeholder for API call to move card to different column
  console.log(
    "Gọi API move card to different column trong file project.api.ts",
  );

  axiosClient.put(`/board-columns/${updateData.prevColumnId}`, {
    taskOrderIds: updateData.prevtaskOrderIds,
  });
  axiosClient.put(`/board-columns/${updateData.nextColumnId}`, {
    taskOrderIds: updateData.nexttaskOrderIds,
  });
  axiosClient.put(`/tasks/${updateData.currentCardId}`, {
    boardColumnId: updateData.nextColumnId,
  });
};

// Columns
export const updateColumnDetailsAPI = async (
  boardColumnId: UniqueIdentifier,
  updateData: Column,
) => {
  // Placeholder for API call to update column details
  console.log("Gọi API update column details trong file project.api.ts");
  axiosClient.put(`/board-columns/${boardColumnId}`, updateData);
};

// Column
export const createNewColumnAPI = async (columnData: {
  name: string;
  projectId: string;
}): Promise<Column> => {
  const createdColumn: Column = await axiosClient.post(
    "/board-columns",
    columnData,
  );
  return createdColumn;
};

export const deleteColumnAPI = async (columnId: string) => {
  await axiosClient.delete(`/board-columns/${columnId}`);
};

// Task
export const createNewTaskAPI = async (taskData: {
  title: string;
  projectId: string;
  boardColumnId: string;
}): Promise<Card> => {
  const createdTask: ApiResponse<Card> = await axiosClient.post("/tasks", taskData);
  return createdTask.data;
};

export const deleteTaskAPI = async (taskId: string) => {
  await axiosClient.delete(`/tasks/${taskId}`);
};

// Add member to project
export const addMemberToProjectAPI = async (memberData: {
  email: string;
  projectId: string;
  role: "OWNER" | "MEMBER";
}): Promise<User> => {
  const res = await axiosClient.post('/project-members', memberData);
  return res.data.user as User;
};
