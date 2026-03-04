import axiosClient from "@/api/axios-client";
import BoardList from "@/components/board-list";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjectStore } from "@/stores/project-store";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {

  const navigate = useNavigate();
  const { projects, setProjects } = useProjectStore()
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await axiosClient.get("/projects/username");
      setProjects(response.data);
    } finally {
      setIsLoading(false);
    }
  }, [setProjects])

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects])

  const handleBoardClick = (boardId: string) => {
    console.log("Board clicked:", boardId);
    // Navigate to board detail page
    navigate(`/p/${boardId}`);
  };

  return (
    <div className="w-full h-full p-8 flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dự án của bạn</h1>
      </div>

      {isLoading ? (
        <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-md">
              <Skeleton className="h-5 w-1/2 mb-3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <BoardList
          className="flex-1"
          boards={projects}
          onBoardClick={handleBoardClick}
        />
      )}
    </div>
  );
}

export default HomePage;
