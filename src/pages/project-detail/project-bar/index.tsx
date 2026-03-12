import { useProjectStore } from "@/stores/project-store";
import { Button } from "@/components/ui/button";
import { CreditCard, ListFilter, Lock, Rocket, Slack, Star, Zap } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";

import ProjectViews from "./project-views";
import ProjectSharing from "./project-sharing";
import ProjectActions from "./project-actions";

function ProjectBar() {
  const { currentActiveProject } = useProjectStore();

  return (
    <div className="h-project-bar-height bg-white/10 backdrop-blur-md border-b border-white/20 px-5 flex items-center justify-between">
      <div className="flex gap-1 items-center">
        <h3 className="font-bold">{currentActiveProject?.name || "No Project Selected"}</h3>
        <ProjectViews />
      </div>
      <div className="flex gap-1 items-center">
        <AvatarGroup className="grayscale">
          {currentActiveProject?.projectMembers.slice(0, 3).map((member) => (
            <Avatar key={member.user.id}>
              <AvatarImage src={member.user.avatar || undefined} alt={member.user.username} />
              <AvatarFallback>{member.user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          ))}
          {
            (currentActiveProject?.projectMembers.length as number) > 3 &&
            <AvatarGroupCount>
              +{currentActiveProject?.projectMembers.length as number - 3}
            </AvatarGroupCount>
          }
        </AvatarGroup>
        <Button variant="ghost" size="icon">
          <Slack />
        </Button>
        <Button variant="ghost" size="icon">
          <CreditCard />
        </Button>
        <Button variant="ghost" size="icon">
          <Rocket />
        </Button>
        <Button variant="ghost" size="icon">
          <Zap />
        </Button>
        <Button variant="ghost" size="icon">
          <ListFilter />
        </Button>
        <Button variant="ghost" size="icon">
          <Star />
        </Button>
        <Button variant="ghost" size="icon">
          <Lock />
        </Button>
        <ProjectSharing />
        <ProjectActions />
      </div>
    </div>
  );
}

export default ProjectBar;
