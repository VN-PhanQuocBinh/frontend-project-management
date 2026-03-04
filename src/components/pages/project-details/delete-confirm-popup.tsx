import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

interface DeleteConfirmPopupProps {
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  isLoading?: boolean;
  onDelete: () => void;
}

const DeleteConfirmPopup = ({
  children,
  align = "end",
  side = "bottom",
  isLoading = false,
  onDelete,
}: DeleteConfirmPopupProps) => {
  const [_, setBoardTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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
        className="w-80 p-3 bg-white shadow-lg rounded-md border border-gray-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between py-1 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-700 text-center flex-1">
            Bạn muốn xoá bình luận?
          </h2>
          <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <div className="py-3">
          <p className="text-sm text-gray-800">
            Bình luận sẽ bị xóa vĩnh viễn và bạn không thể hoàn tác.
          </p>
        </div>

        <Button size="sm" variant="destructive" className="rounded-sm w-full" onClick={onDelete}>
          {isLoading ? <LoaderCircle className="animate-spin" /> : "Xoá"}
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default DeleteConfirmPopup;
