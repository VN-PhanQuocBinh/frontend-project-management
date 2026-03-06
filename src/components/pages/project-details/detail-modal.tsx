import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, MoreHorizontal, Star, X } from "lucide-react";
import CommentSection from "./comment-section";
import DescriptionSection from "./description-section";
import DeadlinePicker from "./deadline-picker";
import MembersSection from "./members-section";
import { toast } from "sonner";
import { getTaskById, updateTask } from "@/api/task.api";
import { type Task } from "@/types/task";
import { Skeleton } from "@/components/ui/skeleton";

export interface Member {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  isAdded: boolean;
}

interface DetailModalProps {
  cardId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DetailModal({ open, cardId, onOpenChange }: DetailModalProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isFetchingTask, setIsFetchingTask] = useState(false);

  useEffect(() => {
    if (cardId) {
      const fetchTask = async () => {
        setIsFetchingTask(true);

        try {
          const taskData = await getTaskById(cardId);
          setTask(taskData);
        } catch (error) {
          console.error("Failed to fetch task details:", error);
          toast.error("Failed to load task details");
        } finally {
          setIsFetchingTask(false);
        }
      };

      fetchTask();
    }
  }, [cardId]);

  const handleUpdateTask = useCallback(
    async (updatedTask: Partial<Task>) => {
      try {
        if (!cardId) return;

        const newTask = await updateTask(cardId, updatedTask);
        setTask(newTask);
      } catch (error) {
        console.error("Failed to update task:", error);
        toast.error("Failed to update task");
      }
    },
    [cardId],
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="flex flex-col overflow-hidden gap-0 max-w-[90vw] min-w-[60vw] max-h-[90vh] p-0"
        >
          <DialogHeader className="flex flex-row items-center justify-between border-b border-gray-300 p-3">
            <div className="">
              <div className="px-3 py-1 rounded-sm bg-gray-200 font-semibold">Not started</div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Star className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
          </DialogHeader>

          <div className="flex flex-row flex-1 overflow-hidden">
            {/* Left Side */}
            <div className="flex-1 p-6 overflow-y-auto border-r border-gray-200">
              <DialogHeader>
                {/* {isFetchingTask ? (
                  <Skeleton className="w-1/2 h-10 mb-2" />
                ) : isEditingTitle ? (
                  <Input
                    value={task?.title || ""}
                    onChange={(e) =>
                      setTask((prev) => (prev ? { ...prev, title: e.target.value } : prev))
                    }
                    onBlur={(e) => {
                      handleUpdateTask({ title: e.target.value });
                      setIsEditingTitle(false);
                    }}
                    className="text-2xl font-semibold"
                    autoFocus
                  />
                ) : (
                  <DialogTitle
                    className="text-2xl cursor-pointer hover:bg-muted/50 p-2 rounded"
                    onClick={() => setIsEditingTitle(true)}
                  >
                    {task?.title || "Task Title"}
                  </DialogTitle>
                )} */}
                <DialogTitle
                  className="text-2xl cursor-pointer hover:bg-muted/50 p-2 rounded"
                  onClick={() => !isFetchingTask && setIsEditingTitle(true)}
                >
                  {isFetchingTask ? (
                    <Skeleton className="w-1/2 h-10 mb-2" />
                  ) : isEditingTitle ? (
                    <Input
                      value={task?.title || ""}
                      onChange={(e) =>
                        setTask((prev) => (prev ? { ...prev, title: e.target.value } : prev))
                      }
                      onBlur={(e) => {
                        handleUpdateTask({ title: e.target.value });
                        setIsEditingTitle(false);
                      }}
                      className="text-2xl font-semibold"
                      autoFocus
                    />
                  ) : (
                    <span>{task?.title || "Task Title"}</span>
                  )}
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 space-y-6">
                {/* Members Section */}
                <MembersSection
                  className=""
                  task={task}
                  addedMembers={task?.taskAssignees || []}
                  isLoading={isFetchingTask}
                  setTask={setTask}
                />

                {/* Deadline */}
                <DeadlinePicker
                  className=""
                  deadline={task?.dueDate}
                  onDeadlineSave={(value) => handleUpdateTask({ dueDate: value })}
                  isLoading={isFetchingTask}
                />

                {/* Description */}
                <DescriptionSection
                  className=""
                  description={task?.description || ""}
                  onSave={(value) => handleUpdateTask({ description: value })}
                  isLoading={isFetchingTask}
                />
              </div>
            </div>

            {/* Right Side - Activity */}
            <CommentSection
              taskId={task?.id || ""}
              className=""
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
