/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Column, Project } from "@/types/project"
import type { UniqueIdentifier } from "@dnd-kit/core"

// Project
export const updateProjectDetailsAPI = async (_projectId: UniqueIdentifier, _updateData: Project) => {
  // Placeholder for API call to update project details
  console.log('Gọi API update project details trong file project.api.ts');
}

export const moveCardToDifferentColumnAPI = async (_updateData: {
  currentCardId: UniqueIdentifier | undefined,
  prevColumnId: UniqueIdentifier | undefined,
  prevCardOrderIds: UniqueIdentifier[] | undefined,
  nextColumnId: UniqueIdentifier | undefined,
  nextCardOrderIds: UniqueIdentifier[] | undefined
}) => {
  // Placeholder for API call to move card to different column
  console.log('Gọi API move card to different column trong file project.api.ts');
}

// Columns
export const updateColumnDetailsAPI = async (_columnId: UniqueIdentifier, _updateData: Column) => {
  // Placeholder for API call to update column details
  console.log('Gọi API update column details trong file project.api.ts');
}