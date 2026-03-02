/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Column, Project } from "@/types/project";
import type { UniqueIdentifier } from "@dnd-kit/core";
import axiosClient from "./axios-client";

// Project
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
  columnId: UniqueIdentifier,
  updateData: Column,
) => {
  // Placeholder for API call to update column details
  console.log("Gọi API update column details trong file project.api.ts");
  axiosClient.put(`/board-columns/${columnId}`, updateData);
};
