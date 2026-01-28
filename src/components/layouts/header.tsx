import {  Bell, Grid2X2 } from "lucide-react";
import ProfilePopup from "../profile-popup";
import NotificationPopup from "../notification-popup";
import SearchBar from "../search-bar";
import CreateBoardPopup from "../create-board-popup";
import { cn } from "@/lib/utils";

const Header = ({ className }: { className?: string }) => {
  return (
    <header className={cn("bg-white border-b border-gray-200 px-4 py-2", className)}>
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Grid Icon */}
          <button className="p-2 hover:bg-gray-100 rounded">
            <Grid2X2 className="w-5 h-5 text-gray-700" />
          </button>

          {/* Trello Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white size-7 rounded font-bold text-sm grid place-items-center">
              T
            </div>
            <span className="font-semibold text-gray-800">Trucllo</span>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-2xl mx-4 flex items-center gap-4">
          <SearchBar />

          {/* Tạo mới Button */}
          <CreateBoardPopup align="center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium text-sm">
              Tạo mới
            </button>
          </CreateBoardPopup>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* <button className="p-2 hover:bg-gray-100 rounded">
            <Megaphone className="w-5 h-5 text-gray-700" />
          </button> */}

          <NotificationPopup>
            <button className="p-2 hover:bg-gray-100 rounded">
              <Bell className="w-5 h-5 text-gray-700" />
            </button>
          </NotificationPopup>

          {/* User Avatar */}
          <ProfilePopup>
            <button className="w-8 h-8 rounded-full bg-orange-500 text-white font-semibold flex items-center justify-center hover:opacity-80">
              PB
            </button>
          </ProfilePopup>
        </div>
      </div>
    </header>
  );
};

export default Header;
