import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface DeadlinePickerProps {
  className?: string;
  deadline: Date | undefined;
  onDeadlineSave: (deadline: Date | undefined) => void;
}

function DeadlinePicker({ className, deadline, onDeadlineSave }: DeadlinePickerProps) {
  return (
    <div className={cn("", className)}>
      <h3 className="text-sm font-medium mb-2">Ngày hết hạn</h3>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-max gap-5 justify-start text-left font-normal rounded-sm shadow-none border-none bg-gray-100 hover:bg-gray-200",
              !deadline && "text-muted-foreground",
            )}
          >
            {deadline ? format(deadline, "PPP") : <span>Chọn ngày hết hạn</span>}
            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={deadline}
            onSelect={onDeadlineSave}
            className="border border-gray-100 shadow-sm"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DeadlinePicker;
