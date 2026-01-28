import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChevronDown,
  Kanban,
  Table,
  Calendar,
  GanttChart,
  LayoutDashboard,
  MapPin,
  Lock,
} from "lucide-react"

interface ViewItem {
  icon: React.ReactNode
  label: string
  isLocked?: boolean
  isActive?: boolean
}

const viewItems: ViewItem[] = [
  {
    icon: <Kanban className="h-5 w-5" />,
    label: "Board",
    isActive: true,
  },
  {
    icon: <Table className="h-5 w-5" />,
    label: "Table",
    isLocked: true,
  },
  {
    icon: <Calendar className="h-5 w-5" />,
    label: "Calendar",
    isLocked: true,
  },
  {
    icon: <GanttChart className="h-5 w-5" />,
    label: "Timeline",
    isLocked: true,
  },
  {
    icon: <LayoutDashboard className="h-5 w-5" />,
    label: "Dashboard",
    isLocked: true,
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    label: "Map",
    isLocked: true,
  },
]

function ProjectViews() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Kanban />
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-75 px-4 py-3">
        {/* Header */}
        <DropdownMenuLabel className="text-center font-normal pb-2 pt-0">
          <span className="font-medium">Upgrade for Views</span>
        </DropdownMenuLabel>

        {/* View Items */}
        <div>
          {viewItems.map((item) => (
            <DropdownMenuItem
              key={item.label}
              className={`flex items-center justify-between py-2.5 cursor-pointer -mx-2 ${
                item.isActive ? "font-medium" : "text-gray-600"
              }`}
              disabled={item.isLocked}
            >
              <div className="flex items-center gap-3">
                <span className={item.isActive ? "text-foreground" : "text-gray-500"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.isLocked && <Lock className="h-4 w-4 text-gray-400" />}
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuLabel className="-mx-2">
          <span className="font-medium">See your work in new ways</span>
        </DropdownMenuLabel>
        {/* Premium Info Section */}
        <div>
          <p className="text-sm text-gray-500 leading-relaxed mb-3">
            View key timelines, assignments, data, and more directly from your Trello board with
            Trello Premium.
          </p>
          <a
            href="#"
            className="text-sm text-blue-600 hover:underline"
            onClick={(e) => e.preventDefault()}
          >
            Learn more about Trello Premium
          </a>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProjectViews
