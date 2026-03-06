import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

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

// const avatarColors = [
//   {
//     bg: "bg-red-500",
//     text: "text-white",
//   },
//   {
//     bg: "bg-green-500",
//     text: "text-white",
//   },
//   {
//     bg: "bg-blue-500",
//     text: "text-white",
//   },
//   {
//     bg: "bg-yellow-500",
//     text: "text-white",
//   },
//   {
//     bg: "bg-purple-500",
//     text: "text-white",
//   },
//   {
//     bg: "bg-pink-500",
//     text: "text-white",
//   },
// ];

function MembersSection({
  addedMembers = [],
  task,
  className,
  isLoading,
  setTask
}: MembersSectionProps) {
  const { currentActiveProject } = useProjectStore()

  
  const notAddedMembers = useMemo(() => {
    return currentActiveProject?.projectMembers.filter(
      (member) => !addedMembers.some((added) => added.user.id === member.user.id)
    ) || [];
  }, [addedMembers, currentActiveProject])

  const handleAddAssignee = async (userId: string) => {
    const addedUser = await addAssignee({
      userId,
      taskId: task?.id || "",
      projectId: currentActiveProject?.id || "",
    })
    
    setTask((prev) => {
      if (!prev) return prev;
      const clonedTask = { ...prev };
      clonedTask.taskAssignees = [...(clonedTask.taskAssignees || []), { user: addedUser }];
      return clonedTask;
    });
  }

  return (
    <div className={cn("", className)}>
      <h3 className="text-sm font-medium mb-2">Thành viên</h3>
      <div className="flex flex-wrap gap-1 mb-2">
        {isLoading ? (
          <Skeleton className="w-[200px] h-10" />
        ) : (
          <>
            {addedMembers.map((member) => (
              <Avatar key={member.user.id} className="size-8">
                <AvatarImage src={member.user.avatar || undefined} className="" />
                <AvatarFallback>
                  <span>
                    {member.user.username[0].toUpperCase()}
                  </span>
                </AvatarFallback>
              </Avatar>
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
                          <Avatar className="size-8">
                            <AvatarImage src={member.user.avatar || undefined} />
                            <AvatarFallback>
                              <span>
                                {member.user.username[0].toUpperCase()}
                              </span>
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{member.user.email}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleAddAssignee(member.user.id)}>
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
