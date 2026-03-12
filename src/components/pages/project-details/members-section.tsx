import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "@/components/user-avatar";

import type { Task, TaskAssignee } from "@/types/task";
import { useProjectStore } from "@/stores/project-store";
import { addAssignee } from "@/api/task.api";
import { useMemo } from "react";

interface MembersSectionProps {
  className?: string;
  task: Task | null;
  addedMembers?: TaskAssignee[];
  isLoading?: boolean;
  setTask: React.Dispatch<React.SetStateAction<Task | null>>;
}

function MembersSection({
  addedMembers = [],
  task,
  className,
  isLoading,
  setTask,
}: MembersSectionProps) {
  const { currentActiveProject } = useProjectStore();

  const notAddedMembers = useMemo(() => {
    return (
      currentActiveProject?.projectMembers.filter(
        (member) => !addedMembers.some((added) => added.user.id === member.user.id),
      ) || []
    );
  }, [addedMembers, currentActiveProject]);

  const handleAddAssignee = async (userId: string) => {
    const addedUser = await addAssignee({
      userId,
      taskId: task?.id || "",
      projectId: currentActiveProject?.id || "",
    });

    setTask((prev) => {
      if (!prev) return prev;
      const clonedTask = { ...prev };
      clonedTask.taskAssignees = [...(clonedTask.taskAssignees || []), { user: addedUser }];
      return clonedTask;
    });
  };

  return (
    <div className={cn("", className)}>
      <h3 className="text-sm font-medium mb-2">Thành viên</h3>
      <div className="flex flex-wrap gap-1 mb-2">
        {isLoading ? (
          <Skeleton className="w-[200px] h-10" />
        ) : (
          <>
            {addedMembers.map((member) => (
              <UserAvatar
                key={member.user.id}
                username={member.user.username}
                avatar={member.user.avatar || ""}
              />
            ))}

            <Popover>
              <PopoverTrigger asChild>
                <Button size="icon-sm" variant="secondary" className="size-8 rounded-full">
                  <PlusIcon className="" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 rounded-lg border border-gray-200 p-3" align="start">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm mb-3">Thành viên có sẵn</h4>
                  <div className="space-y-1 max-h-[300px] overflow-y-auto">
                    {notAddedMembers.map((member) => (
                      <div
                        key={member.user.id}
                        className="flex items-center justify-between p-2 hover:bg-muted rounded"
                      >
                        <div className="flex items-center gap-2">
                          <UserAvatar
                            key={member.user.id}
                            username={member.user.username}
                            avatar={member.user.avatar || ""}
                          />
                          <span className="text-sm">{member.user.email}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddAssignee(member.user.id)}
                        >
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </>
        )}
      </div>
    </div>
  );
}

export default MembersSection;
