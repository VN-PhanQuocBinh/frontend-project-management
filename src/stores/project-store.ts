import { create } from "zustand";
import type { Project, ProjectStore } from "@/types/project.ts";
import { mapOrder } from "@/utils/sort";
import { generatePlaceholderCard } from "@/utils/formatters";
import axiosClient from "@/api/axios-client";
// import { mockData } from "@/api/mock-data";

export const useProjectStore = create<ProjectStore>((set) => ({
  currentActiveProject: null,
  projects: [],
  setCurrentActiveProject: (project) => set({ currentActiveProject: project }),
  setProjects: (projects) => set({ projects }),
  updateCardInProject: (updatedCard) =>
    set((state) => {
      const project = state.currentActiveProject;
      if (!project) return state;
      const updatedColumns = project.boardColumns.map((column) => {
        if (column.id === updatedCard.boardColumnId) {
          const updatedCards = column.tasks.map((card) =>
            card.id === updatedCard.id ? { ...card, ...updatedCard } : card,
          );
          return { ...column, tasks: updatedCards };
        }
        return column;
      });
      return {
        currentActiveProject: {
          ...project,
          boardColumns: updatedColumns,
        },
      };
    }),
  fetchProjectDetailsAPI: async (projectId) => {
    // console.log("Gọi API fetch chi tiết project với ID:", projectId);
    // Giả lập gọi API với dữ liệu mock
    // set({ currentActiveProject: mockData.project as Project });

    axiosClient
      .get(`/projects/${projectId}`)
      .then((data) => {
        // console.log("Dữ liệu project nhận được từ API:", data.data);
        const projectData = data.data as Project;
        projectData.boardColumns = mapOrder(
          projectData.boardColumns,
          projectData.columnOrderIds,
          "id",
        );
        projectData.boardColumns.forEach((column) => {
          if (column.tasks.length === 0) {
            column.tasks = [generatePlaceholderCard(column)];
            column.taskOrderIds = [generatePlaceholderCard(column).id];
          }
          column.tasks = mapOrder(column.tasks, column.taskOrderIds, "id");
          column.tasks.forEach((task) => {
            task.boardColumnId = column.id; // Gán boardColumnId cho mỗi task để dễ dàng truy cập sau này
          });
        });
        set({ currentActiveProject: data.data as Project });
      })
      .catch((error) => {
        console.error("Error fetching project details:", error);
      });
  },
}));
