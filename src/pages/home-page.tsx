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
    <div className="w-full h-full p-8 flex flex-col max-w-5xl mx-auto">
      <div className="mb-5">
        <span className="text-xl font-bold uppercase text-gray-600">Dự án của bạn</span>
      </div>

      {isLoading ? (
        <div className="overflow-y-auto custom-scrollbar pr-2 grid grid-cols-4 gap-3 p-0.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="w-full bg-white rounded-lg shadow-[0px_1px_1px_#1E1F2140,0px_0px_1px_#1E1F214F] overflow-hidden"
            >
              <Skeleton className="h-22 w-full" />
              <div className="p-3 flex gap-2 items-center justify-between">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <BoardList
          boards={projects}
          onBoardClick={handleBoardClick}
        />
      )}
    </div>
  );
}

export default HomePage;
