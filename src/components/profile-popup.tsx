import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ExternalLink, LogOut } from "lucide-react";
import { Tooltip } from "./ui/tooltip";
import { useAuthStore } from "@/stores/auth-store";
import { Link } from "react-router-dom";
import UserAvatar from "@/components/user-avatar";

interface ProfilePopupProps {
  children: React.ReactNode;
}

const ProfilePopup = ({ children }: ProfilePopupProps) => {
  const { logout, user } = useAuthStore();
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip content="Tài khoản">
        <PopoverTrigger asChild>{children}</PopoverTrigger>
      </Tooltip>

      <PopoverContent
        align="end"
        className="w-80 p-0 bg-white shadow-lg rounded-md border border-gray-200"
      >
        {/* Header - User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="text-xs font-semibold text-gray-500 mb-3">TÀI KHOẢN</div>
          <div className="flex items-center gap-3">
            <UserAvatar username={user?.username || "User"} avatar={user?.avatar || ""} size={40} />
            <div>
              <div className="font-semibold text-gray-900">{user?.username}</div>
              <div className="text-sm text-gray-600">{user?.email || "user@example.com"}</div>
            </div>
          </div>
        </div>

        {/* Account Management */}
        <div className="py-2">
          <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors">
            Chuyển đổi Tài khoản
          </button>
          <Link to="/profile" onClick={() => setOpen(false)}>
            <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-between">
              <span>Quản lý tài khoản</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* Logout */}
        <div className="border-t border-gray-200 py-2">
          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProfilePopup;
