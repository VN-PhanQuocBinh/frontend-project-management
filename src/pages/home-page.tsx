import BoardList from "@/components/board-list";

function HomePage() {
  const sampleBoards = [
    {
      id: "1",
      title: "Nguyên lý xây dựng phần mềm",
      createdBy: {
        name: "Phan Quốc Bình",
        avatar: "",
      },
      color: "linear-gradient(to bottom right, #eab308, #ca8a04)",
    },
    {
      id: "2",
      title: "Client Workflow Management",
      createdBy: {
        name: "John Doe",
      },
      color: "linear-gradient(to bottom right, #f59e0b, #d97706)",
    },
    {
      id: "3",
      title: "Không có tiêu đề",
      createdBy: {
        name: "Phan Quốc Bình",
      },
      color: "linear-gradient(to bottom right, #3b82f6, #2563eb)",
    },
    {
      id: "4",
      title: "Project Management Dashboard",
      createdBy: {
        name: "Jane Smith",
      },
      color: "linear-gradient(to bottom right, #10b981, #059669)",
    },
    {
      id: "5",
      title: "Project Management Dashboard",
      createdBy: {
        name: "Jane Smith",
      },
      color: "linear-gradient(to bottom right, #10b981, #059669)",
    },
    {
      id: "6",
      title: "Project Management Dashboard",
      createdBy: {
        name: "Jane Smith",
      },
      color: "linear-gradient(to bottom right, #10b981, #059669)",
    },
    {
      id: "7",
      title: "Project Management Dashboard",
      createdBy: {
        name: "Jane Smith",
      },
      color: "linear-gradient(to bottom right, #10b981, #059669)",
    },
    {
      id: "8",
      title: "Project Management Dashboard",
      createdBy: {
        name: "Jane Smith",
      },
      color: "linear-gradient(to bottom right, #10b981, #059669)",
    },
    {
      id: "9",
      title: "Project Management Dashboard",
      createdBy: {
        name: "Jane Smith",
      },
      color: "linear-gradient(to bottom right, #10b981, #059669)",
    },
    {
      id: "10",
      title: "Project Management Dashboard",
      createdBy: {
        name: "Jane Smith",
      },
      color: "linear-gradient(to bottom right, #10b981, #059669)",
    },
    {
      id: "11",
      title: "Project Management Dashboard",
      createdBy: {
        name: "Jane Smith",
      },
      color: "linear-gradient(to bottom right, #10b981, #059669)",
    },
    {
      id: "12",
      title: "Project Management Dashboard",
      createdBy: {
        name: "Jane Smith",
      },
      color: "linear-gradient(to bottom right, #10b981, #059669)",
    },
  ];

  const handleBoardClick = (boardId: string) => {
    console.log("Board clicked:", boardId);
    // Navigate to board detail page
  };

  return (
    <div className="w-full h-full p-8 flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bảng của bạn</h1>
      </div>

      <BoardList className="flex-1" boards={sampleBoards} onBoardClick={handleBoardClick} />
    </div>
  );
}

export default HomePage;
