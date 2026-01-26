import type { Column } from "@/types/project"

export const generatePlaceholderCard = (column: Column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.projectId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}