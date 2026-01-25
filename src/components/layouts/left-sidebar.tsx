import React from "react";
import { LayoutDashboard, Trello, Activity } from "lucide-react";

const LeftSidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen p-4">
      <nav className="space-y-1">
        {/* Bảng */}
        <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">Bảng</span>
        </button>

        {/* Mẫu */}
        <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Trello className="w-5 h-5" />
          <span className="font-medium">Mẫu</span>
        </button>

        {/* Trang chủ */}
        <button className="w-full flex items-center gap-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg transition-colors">
          <Activity className="w-5 h-5" />
          <span className="font-medium">Trang chủ</span>
        </button>
      </nav>
    </aside>
  );
};

export default LeftSidebar;
