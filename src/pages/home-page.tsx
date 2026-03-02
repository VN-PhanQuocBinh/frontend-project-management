import axiosClient from "@/api/axios-client";
import BoardList from "@/components/board-list";
import { useProjectStore } from "@/stores/project-store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {

  const navigate = useNavigate();
  const { projects, setProjects } = useProjectStore()

  const fetchProjects = async () => {
    axiosClient.get("/projects")
      .then((response) => {
        // console.log(response.data)
        setProjects(response.data);
      })
  }

  useEffect(() => {
    fetchProjects();
  }, [])

  const handleBoardClick = (boardId: string) => {
    console.log("Board clicked:", boardId);
    // Navigate to board detail page
    navigate(`/p/${boardId}`);
  };

  return (
    <div className="w-full h-full p-8 flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bảng của bạn</h1>
      </div>

      <BoardList
        className="flex-1"
        boards={projects}
        onBoardClick={handleBoardClick}
      />
    </div>
  );
}

export default HomePage;
