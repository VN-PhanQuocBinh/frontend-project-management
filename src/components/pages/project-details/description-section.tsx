import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DescriptionSectionProps {
  className?: string;
  onSave: (description: string) => void;
}

function DescriptionSection({ className, onSave }: DescriptionSectionProps) {
  const [description, setDescription] = useState("");
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const handleSave = () => {
    onSave(description);
    setIsEditingDescription(false);
  };

  return (
    <div className={cn("", className)}>
      <h3 className="text-sm font-medium mb-2">Mô tả</h3>
      {isEditingDescription ? (
        <div>
          <Textarea
            value={description}
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
          {description || "Thêm mô tả chi tiết hơn..."}
        </div>
      )}
    </div>
  );
}

export default DescriptionSection;
