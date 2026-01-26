import { create } from "zustand";
import type { Project, ProjectStore } from "@/types/project.ts";
import { mockData } from "@/api/mock-data";

export const useProjectStore = create<ProjectStore>((set) => ({
  currentActiveProject: null,
  setCurrentActiveProject: (project) => set({ currentActiveProject: project }),
  updateCardInProject: (updatedCard) =>
    set((state) => {
      const project = state.currentActiveProject;
      if (!project) return state;
      const updatedColumns = project.columns.map((column) => {
        if (column._id === updatedCard.columnId) {
          const updatedCards = column.cards.map((card) =>
            card._id === updatedCard._id ? { ...card, ...updatedCard } : card
          );
          return { ...column, cards: updatedCards };
        }
        return column;
      });
      return {
        currentActiveProject: {
          ...project,
          columns: updatedColumns,
        },
      };
    }),
  fetchProjectDetailsAPI: async (projectId) => {
    console.log("Gọi API fetch chi tiết project với ID:", projectId);
    // Giả lập gọi API với dữ liệu mock
    set({ currentActiveProject: mockData.project as Project });
  }
}))