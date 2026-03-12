import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { LoaderCircle } from "lucide-react";

interface DescriptionSectionProps {
  description: string;
  className?: string;
  isLoading?: boolean;
  isUpdating?: boolean;
  onSave: (description: string) => Promise<void>;
}

function DescriptionSection({
  className,
  description,
  isLoading,
  isUpdating,
  onSave,
}: DescriptionSectionProps) {
  const [descriptionValue, setDescription] = useState(description);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setDescription(description);
  }, [description]);

  useEffect(() => {
    if (isEditingDescription && inputRef.current) {
      const textarea = inputRef.current;
      const length = textarea.value.length;

      // Set focus
      textarea.focus();

      // Đặt cursor ở cuối
      textarea.setSelectionRange(length, length);
    }
  }, [isEditingDescription]);

  const handleSave = async () => {
    await onSave(descriptionValue);
    setIsEditingDescription(false);
  };

  const handleCancel = () => {
    setDescription(description);
    setIsEditingDescription(false);
  };

  return (
    <div className={cn("", className)}>
      <h3 className="text-sm font-medium mb-2">Mô tả</h3>
      {isLoading ? (
        <Skeleton className="w-full h-24" />
      ) : isEditingDescription ? (
        <div>
          <Textarea
            ref={inputRef}
            value={descriptionValue}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Thêm mô tả chi tiết hơn..."
            className="min-h-[100px] mb-4"
            autoFocus
          />

          <div className="flex items-center justify-end w-full">
            <Button variant="secondary" className="mr-2" onClick={handleCancel}>
              Hủy bỏ
            </Button>
            <Button onClick={handleSave} className="min-w-[60px]">
              {isUpdating ? <LoaderCircle className="animate-spin" /> : "Lưu"}
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="min-h-[100px] p-3 rounded border border-input cursor-pointer hover:bg-muted/50"
          onClick={() => setIsEditingDescription(true)}
        >
          {descriptionValue || (
            <span className="text-sm text-gray-500">Thêm mô tả chi tiết hơn...</span>
          )}
        </div>
      )}
    </div>
  );
}

export default DescriptionSection;
