import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus, Link2, ChevronDown } from "lucide-react"

interface BoardMember {
  id: string
  name: string
  username: string
  role: "Admin" | "Member"
  workspaceRole: "Workspace admin" | "Workspace guest"
  avatarColor: string
  avatarUrl?: string
  isCurrentUser?: boolean
}

// Mock data for board members
const mockBoardMembers: BoardMember[] = [
  {
    id: "1",
    name: "Quốc Hội",
    username: "henrylam2207",
    role: "Member",
    workspaceRole: "Workspace guest",
    avatarColor: "bg-orange-500",
    isCurrentUser: true,
  },
  {
    id: "2",
    name: "Phan Quốc Bình",
    username: "phanqucbinh",
    role: "Admin",
    workspaceRole: "Workspace admin",
    avatarColor: "bg-green-600",
  },
  {
    id: "3",
    name: "Bình Thái",
    username: "binhthai6",
    role: "Member",
    workspaceRole: "Workspace guest",
    avatarColor: "bg-cyan-500",
  },
  {
    id: "4",
    name: "Ngo Quoc Cuong B2303801",
    username: "ngoquoccuongb2303801",
    role: "Member",
    workspaceRole: "Workspace guest",
    avatarColor: "bg-green-500",
  },
  {
    id: "5",
    name: "Quốc An",
    username: "qucan1",
    role: "Member",
    workspaceRole: "Workspace guest",
    avatarColor: "bg-amber-500",
  },
]

function getInitials(name: string): string {
  const words = name.split(" ")
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

function ProjectSharing() {
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<"Admin" | "Member">("Member")
  const [members, setMembers] = useState<BoardMember[]>(mockBoardMembers)

  const handleRoleChange = (memberId: string, newRole: "Admin" | "Member") => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === memberId ? { ...member, role: newRole } : member
      )
    )
  }

  const handleShare = () => {
    if (inviteEmail.trim()) {
      // TODO: Implement share logic
      console.log("Sharing with:", inviteEmail, "as", inviteRole)
      setInviteEmail("")
    }
  }

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
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-25 justify-between">
                  {inviteRole}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setInviteRole("Member")}>
                  Member
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setInviteRole("Admin")}>
                  Admin
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleShare} className="bg-blue-600 hover:bg-blue-700">
              Share
            </Button>
          </div>
        </div>

        {/* Share with link section */}
        <div className="px-6 pb-4">
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
        </div>

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
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    {member.avatarUrl ? (
                      <AvatarImage src={member.avatarUrl} alt={member.name} />
                    ) : null}
                    <AvatarFallback className={`${member.avatarColor} text-white text-xs font-medium`}>
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {member.name}
                      {member.isCurrentUser && (
                        <span className="text-gray-500 font-normal"> (you)</span>
                      )}
                    </span>
                    <span className="text-xs text-gray-500">
                      @{member.username} • {member.workspaceRole}
                    </span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="min-w-22.5 justify-between"
                      disabled={member.role === "Admin" && member.workspaceRole === "Workspace admin"}
                    >
                      {member.role}
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleRoleChange(member.id, "Member")}>
                      Member
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleChange(member.id, "Admin")}>
                      Admin
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProjectSharing
