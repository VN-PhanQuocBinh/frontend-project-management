import type { Column } from "@/types/project"

export const generatePlaceholderCard = (column: Column) => {
  return {
    id: `${column.id}-placeholder-card`,
    boardId: column.projectId,
    boardColumnId: column.id,
    FE_PlaceholderCard: true
  }
}