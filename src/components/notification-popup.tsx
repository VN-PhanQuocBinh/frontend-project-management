import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreVertical } from "lucide-react";

interface NotificationPopupProps {
  children: React.ReactNode;
}

const NotificationPopup = ({ children }: NotificationPopupProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-96 p-0 bg-white shadow-lg rounded-md border border-gray-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Thông báo</h2>
          {/* <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Chỉ hiển thị chưa đọc</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div> */}
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <p className="text-gray-400 font-medium text-center">Không có Thông báo chưa đọc</p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopup;
