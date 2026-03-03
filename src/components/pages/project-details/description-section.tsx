import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface DescriptionSectionProps {
  description: string;
  className?: string;
  isLoading?: boolean;
  onSave: (description: string) => void;
}

function DescriptionSection({
  className,
  description,
  isLoading,
  onSave,
}: DescriptionSectionProps) {
  const [descriptionValue, setDescription] = useState(description);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const handleSave = () => {
    onSave(descriptionValue);
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
            value={descriptionValue}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => setIsEditingDescription(false)}
            placeholder="Thêm mô tả chi tiết hơn..."
            className="min-h-[100px] mb-4"
            autoFocus
          />

          <div className="flex items-center justify-end w-full">
            <Button
              variant="secondary"
              className="mr-2"
              onClick={() => {
                setIsEditingDescription(false);
                setDescription("");
              }}
            >
              Hủy bỏ
            </Button>
            <Button onClick={handleSave}>Lưu</Button>
          </div>
        </div>
      ) : (
        <div
          className="min-h-[100px] p-3 rounded border border-input cursor-pointer hover:bg-muted/50"
          onClick={() => setIsEditingDescription(true)}
        >
          {descriptionValue || "Thêm mô tả chi tiết hơn..."}
        </div>
      )}
    </div>
  );
}

export default DescriptionSection;
