import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { UserPlus, ChevronDown, LoaderCircle } from "lucide-react";
import { addMemberToProjectAPI, getAllProjectMembersAPI, updateMemberRoleAPI } from "@/api/project.api";
import { useProjectStore } from "@/stores/project-store";
import type { Project, ProjectMember, User } from "@/types/project";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import UserAvatar from "@/components/user-avatar";

function ProjectSharing() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"Owner" | "Member" | "Manager">("Member");
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const { currentActiveProject, setCurrentActiveProject } = useProjectStore();

  useEffect(() => {
    const fetchProjectMembers = async () => {
      setIsLoading(true);
      try {
        const projectMembers = await getAllProjectMembersAPI(currentActiveProject?.id as string);
        setMembers(projectMembers);
      } catch (error) {
        console.error("Failed to fetch project members:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentActiveProject?.id) {
      fetchProjectMembers();
    }
  }, []);

  const handleRoleChange = async (memberId: string, newRole: ProjectMember["role"]) => {
    setMembers((prev) => {
      return prev.map((member) =>
        member.user.id === memberId ? { ...member, role: newRole } : member,
      );
    });

    try {
      await updateMemberRoleAPI({
        email: members.find((m) => m.user.id === memberId)?.user.email as string,
        projectId: currentActiveProject?.id as string,
        role: newRole,
      });

      const newProject: Project = { ...currentActiveProject } as Project;
      const memberIndex = newProject.projectMembers.findIndex((m) => m.user.id === memberId);
      if (memberIndex !== -1) {
        newProject.projectMembers[memberIndex].role = newRole;
        setCurrentActiveProject(newProject);
      }

      toast.success("Cập nhật vai trò thành công!");
    } catch (error: any) {
      console.error("Failed to update member role:", error);
      toast.error("Cập nhật vai trò thất bại!");
    }
  };

  const handleShare = async () => {
    if (!inviteEmail.trim()) return;

    try {
      const newMember: User = await addMemberToProjectAPI({
        email: inviteEmail,
        projectId: currentActiveProject?.id as string, // Replace with actual project ID
        role: inviteRole.toUpperCase() as "OWNER" | "MEMBER" | "MANAGER",
      });

      const newProject: Project = { ...currentActiveProject } as Project;
      newProject.projectMembers.push({
        user: newMember,
        role: inviteRole.toUpperCase() as "OWNER" | "MEMBER" | "MANAGER",
      });

      setMembers((prev) => [...prev, { user: newMember, role: inviteRole.toUpperCase() as "OWNER" | "MEMBER" | "MANAGER" }]);
      setCurrentActiveProject(newProject);
      setInviteEmail("");
      toast.success(`Thêm thành viên ${newMember.username} với vai trò ${inviteRole} thành công!`);
    } catch (error: any) {
      console.log(error.response.data.message);
      setError(error?.response?.data?.message || "Failed to add member");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInviteEmail(e.target.value);
    setError(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <UserPlus />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125 gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold">Share board</DialogTitle>
        </DialogHeader>

        {/* Invite Section */}
        <div className="px-6 pb-4">
          <div className="flex gap-2">
            <Input
              placeholder="Email address or name"
              value={inviteEmail}
              onChange={handleInputChange}
              className="flex-1"
            />
            <DropdownMenu>
              <DropdownMenuTrigger disabled={isLoading} asChild>
                <Button variant="outline" className="min-w-25 justify-between uppercase">
                  {inviteRole}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setInviteRole("Member")}>MEMBER</DropdownMenuItem>
                {/* <DropdownMenuItem onClick={() => setInviteRole("Owner")}>OWNER</DropdownMenuItem> */}
                <DropdownMenuItem onClick={() => setInviteRole("Manager")}>MANAGER</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              disabled={isLoading || !inviteEmail.trim()}
              onClick={handleShare}
              className="bg-blue-600 hover:bg-blue-700 min-w-[60px]"
            >
              {isLoading ? <LoaderCircle className="animate-spin" /> : "Thêm"}
            </Button>
          </div>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>

        {/* Share with link section */}
        {/* <div className="px-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <Link2 className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Share this board with a link</span>
              <button className="text-sm text-blue-600 hover:underline text-left">
                Create link
              </button>
            </div>
          </div>
        </div> */}

        <Separator />

        {/* Board members section */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium">Board members</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
              {members.length}
            </span>
          </div>

          <div className="flex flex-col gap-3 max-h-75 overflow-y-auto">
            {members.map((member) => (
              <div key={member.user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    username={member.user.username}
                    avatar={member.user.avatar || ""}
                    className="h-10 w-10"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {member.user.username}
                      {member.user.id === user?.id && (
                        <span className="text-gray-500 font-normal"> (you)</span>
                      )}
                    </span>
                    <span className="text-xs text-gray-500">@{member.user.username}</span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="min-w-22.5 justify-between"
                      disabled={member.role === "OWNER"}
                    >
                      {member.role}
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleRoleChange(member.user.id, "MEMBER")}>
                      MEMBER
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem onClick={() => handleRoleChange(member.user.id, "OWNER")}>
                      OWNER
                    </DropdownMenuItem> */}
                    <DropdownMenuItem onClick={() => handleRoleChange(member.user.id, "MANAGER")}>
                      MANAGER
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProjectSharing;
