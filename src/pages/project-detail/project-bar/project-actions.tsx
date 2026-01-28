import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Ellipsis,
  Users,
  Info,
  Lock,
  Share2,
  Star,
  Settings,
  Square,
  FolderClosed,
  Zap,
  Puzzle,
  Tag,
  StickyNote,
  List,
  Archive,
  Eye,
  Copy,
  Mail,
  LogOut,
  Slack,
  Monitor,
} from "lucide-react"

interface BoardMember {
  initials: string
  color: string
}

const boardMembers: BoardMember[] = [
  { initials: "QH", color: "bg-orange-500" },
  { initials: "PB", color: "bg-green-600" },
  { initials: "BT", color: "bg-cyan-500" },
  { initials: "NB", color: "bg-green-500" },
  { initials: "QA", color: "bg-amber-500" },
]

function ProjectActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[320px] px-2">
        {/* Header */}
        <DropdownMenuLabel className="text-center font-medium py-3">
          Menu
        </DropdownMenuLabel>

        <div className="max-h-130 overflow-auto">
          {/* Share Section */}
          <DropdownMenuItem className="flex items-center justify-between px-4 py-3 cursor-pointer">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-600" />
              <span>Share</span>
            </div>
            <div className="flex -space-x-1">
              {boardMembers.map((member, index) => (
                <Avatar key={index} className="h-7 w-7 border-2 border-white">
                  <AvatarFallback className={`${member.color} text-white text-xs font-medium`}>
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="m-0" />

          {/* Board Info Section */}
          <div className="py-1">
            <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
              <Info className="h-5 w-5 text-gray-600" />
              <span>About this board</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
              <Lock className="h-5 w-5 text-gray-600" />
              <span>Visibility: Private</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
              <Share2 className="h-5 w-5 text-gray-600" />
              <span>Print, export, and share</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
              <Star className="h-5 w-5 text-gray-600" />
              <span>Star</span>
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator className="m-0" />

          {/* Settings Section */}
          <div className="py-1">
            <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
              <Settings className="h-5 w-5 text-gray-600" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
              <Square className="h-5 w-5 text-green-700 fill-green-700" />
              <span>Change background</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
              <FolderClosed className="h-5 w-5 text-gray-600" />
              <span></span>
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator className="m-0" />

          {/* Tools Section */}
          <div className="py-1">
            <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
              <Zap className="h-5 w-5 text-gray-600" />
              <span>Automation</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center justify-between px-4 py-2.5 cursor-pointer">
              <div className="flex items-center gap-3">
                <Puzzle className="h-5 w-5 text-gray-600" />
                <span>Power-Ups</span>
              </div>
              <div className="flex items-center gap-2">
                <Slack className="h-5 w-5 text-gray-500" />
                <Monitor className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-500">+1</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
              <Tag className="h-5 w-5 text-gray-600" />
              <span>Labels</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
              <StickyNote className="h-5 w-5 text-gray-600" />
              <span>Stickers</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
              <List className="h-5 w-5 text-gray-600" />
              <span>Activity</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
              <Archive className="h-5 w-5 text-gray-600" />
              <span>Archived items</span>
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator className="m-0" />

          {/* More Actions Section */}
          <div className="py-1">
            <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
              <Eye className="h-5 w-5 text-gray-600" />
              <span>Watch</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
              <Copy className="h-5 w-5 text-gray-600" />
              <span>Copy board</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
              <Mail className="h-5 w-5 text-gray-600" />
              <span>Email-to-board</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
              <LogOut className="h-5 w-5 text-gray-600" />
              <span>Leave board</span>
            </DropdownMenuItem>
          </div>
        </div>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProjectActions