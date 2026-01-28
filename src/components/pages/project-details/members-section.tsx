import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import type { Member } from "./detail-modal";

interface MembersSectionProps {
  className?: string;
  addedMembers?: Member[];
  availableMembers?: Member[];
  toggleMember: (memberId: string) => void;
}

const avatarColors = [
  {
    bg: "bg-red-500",
    text: "text-white",
  },
  {
    bg: "bg-green-500",
    text: "text-white",
  },
  {
    bg: "bg-blue-500",
    text: "text-white",
  },
  {
    bg: "bg-yellow-500",
    text: "text-white",
  },
  {
    bg: "bg-purple-500",
    text: "text-white",
  },
  {
    bg: "bg-pink-500",
    text: "text-white",
  },
];

function MembersSection({
  addedMembers = [],
  availableMembers = [],
  toggleMember,
}: MembersSectionProps) {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Thành viên</h3>
      <div className="flex flex-wrap gap-1 mb-2">
        {addedMembers.map((member) => (
          <Avatar key={member.id} className="size-8">
            <AvatarImage src={member.avatar} className="" />
            <AvatarFallback
              className={cn(avatarColors[addedMembers.indexOf(member) % avatarColors.length].bg)}
            >
              <span
                className={cn(
                  avatarColors[addedMembers.indexOf(member) % avatarColors.length].text,
                )}
              >
                {member.initials}
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
                {availableMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2 hover:bg-muted rounded"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback
                          className={cn(
                            avatarColors[availableMembers.indexOf(member) % avatarColors.length].bg,
                          )}
                        >
                          <span
                            className={cn(
                              avatarColors[availableMembers.indexOf(member) % avatarColors.length]
                                .text,
                            )}
                          >
                            {member.initials}
                          </span>
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{member.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => toggleMember(member.id)}>
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export default MembersSection;
