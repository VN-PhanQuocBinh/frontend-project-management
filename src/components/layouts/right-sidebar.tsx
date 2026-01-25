import { Plus } from "lucide-react";
import CreateBoardPopup from "../create-board-popup";

const RightSidebar = () => {
  return (
    <aside className="w-72 shrink-0 bg-white border-l border-gray-200 h-screen p-4">
      <div className="flex flex-col">
        <span className="font-semibold mb-4">Hành động</span>
        <div className="flex flex-col">
          <CreateBoardPopup side="left" align="center">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="bg-gray-300 px-2 py-1 rounded-md">
                <Plus className="w-5 h-5 " />
              </span>
              Tạo bảng mới
            </button>
          </CreateBoardPopup>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
