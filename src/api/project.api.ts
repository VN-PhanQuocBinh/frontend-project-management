/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Column, Project } from "@/types/project"
import type { UniqueIdentifier } from "@dnd-kit/core"

// Project
export const updateProjectDetailsAPI = async (projectId: UniqueIdentifier, updateData: Project) => {
  // Placeholder for API call to update project details
  console.log('Gọi API update project details trong file project.api.ts');
  fetch(`http://localhost:8080/api/v1/projects/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(updateData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Dữ liệu project sau khi cập nhật nhận được từ API:", data.data);
    })
    .catch((error) => {
      console.error("Lỗi khi cập nhật project:", error);
    });
}

export const moveCardToDifferentColumnAPI = async (updateData: {
  currentCardId: UniqueIdentifier | undefined,
  prevColumnId: UniqueIdentifier | undefined,
  prevtaskOrderIds: UniqueIdentifier[] | undefined,
  nextColumnId: UniqueIdentifier | undefined,
  nexttaskOrderIds: UniqueIdentifier[] | undefined
}) => {
  // Placeholder for API call to move card to different column
  console.log('Gọi API move card to different column trong file project.api.ts');

  const promise1 = fetch(`http://localhost:8080/api/v1/board-columns/${updateData.prevColumnId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      taskOrderIds: updateData.prevtaskOrderIds
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Dữ liệu project sau khi cập nhật nhận được từ API:", data.data);
    })
    .catch((error) => {
      console.error("Lỗi khi cập nhật project:", error);
    });

  const promise2 = fetch(`http://localhost:8080/api/v1/board-columns/${updateData.nextColumnId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      taskOrderIds: updateData.nexttaskOrderIds
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Dữ liệu project sau khi cập nhật nhận được từ API:", data.data);
    })
    .catch((error) => {
      console.error("Lỗi khi cập nhật project:", error);
    });

  const promise3 = fetch(`http://localhost:8080/api/v1/tasks/${updateData.currentCardId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      boardColumnId: updateData.nextColumnId
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Dữ liệu project sau khi cập nhật nhận được từ API:", data.data);
    })
    .catch((error) => {
      console.error("Lỗi khi cập nhật project:", error);
    });
  
  await Promise.all([promise1, promise2, promise3]);
}

// Columns
export const updateColumnDetailsAPI = async (columnId: UniqueIdentifier, updateData: Column) => {
  // Placeholder for API call to update column details
  console.log('Gọi API update column details trong file project.api.ts');
  fetch(`http://localhost:8080/api/v1/board-columns/${columnId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(updateData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Dữ liệu project sau khi cập nhật nhận được từ API:", data.data);
    })
    .catch((error) => {
      console.error("Lỗi khi cập nhật project:", error);
    });
}