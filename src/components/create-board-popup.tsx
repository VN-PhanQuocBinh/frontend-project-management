import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X } from "lucide-react";

interface CreateBoardPopupProps {
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

const CreateBoardPopup = ({ children, align = "end", side = "bottom" }: CreateBoardPopupProps) => {
  const [boardTitle, setBoardTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (boardTitle.trim()) {
      // Handle create board logic here
      console.log("Creating board:", boardTitle);
      setBoardTitle("");
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setBoardTitle("");
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent
        align={align}
        side={side}
        className="w-80 p-0 bg-white shadow-lg rounded-md border border-gray-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-700 text-center flex-1">Tạo bảng</h2>
          <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="board-title" className="block text-xs font-semibold text-gray-700 mb-2">
              Tiêu đề bảng <span className="text-red-500">*</span>
            </label>
            <input
              id="board-title"
              type="text"
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              placeholder="Nhập tiêu đề bảng..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!boardTitle.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-medium text-sm transition-colors"
          >
            Tạo bảng
          </button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default CreateBoardPopup;
