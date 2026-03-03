import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
// import { useDispatch } from 'react-redux'
// import { updateCurrentActiveCard, showModalActiveCard } from '~/redux/activeCard/activeCardSlice'
import type { Card as CardType, Project } from '@/types/project'
import {
  Card,
  // CardContent,
  // CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from '@/lib/utils'
import { ContextMenu, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { useProjectStore } from '@/stores/project-store'

interface IProps {
  card: CardType
  onClick?: (cardId: string) => void
}

function CardItem({ card, onClick }: IProps) {
  // const dispatch = useDispatch()
  const { currentActiveProject, setCurrentActiveProject } = useProjectStore()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: card.id,
    data: { ...card }
  })
  // Nếu sử dụng CSS.Transform như docs sẽ lỗi kiểu stretch
  const dndKitCardStyles = {
    touchAction: 'none', // Dành cho pointer event dạng pointer sensor
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? '0.5' : undefined,
    border: isDragging ? '1px solid #2ecc71' : undefined
  }

  const handleDeleteTask = () => {
    const currentProject = { ...currentActiveProject }
    if (!currentProject) return
    const targetColumn = currentProject?.boardColumns?.find(column => column.id === card.boardColumnId)
    if (!targetColumn) return
    targetColumn.taskOrderIds = targetColumn.taskOrderIds.filter(id => id !== card.id)
    targetColumn.tasks = targetColumn.tasks.filter(task => task.id !== card.id)
    setCurrentActiveProject(currentProject as Project)

    console.log("Gọi API xóa task với ID: ", card.id)
  }

  // const shouldShowCardActions =
  // !!card?.memberIds?.length ||
  // !!card?.comments?.length ||
  // !!card?.attachments?.length

  return (
    <ContextMenu>
      <ContextMenuTrigger>

        <Card
          ref={setNodeRef}
          style={dndKitCardStyles}
          {...attributes}
          {...listeners}
          onClick={() => onClick?.(card.id)}
          className={cn(
            card?.FE_PlaceholderCard ? 'hidden' : 'block',
            'cursor-pointer hover:shadow-md transition-shadow rounded-lg p-0'
          )}
        >
          <CardHeader className="p-3 gap-0">
            <CardTitle className="text-sm font-normal leading-5">{card.title}</CardTitle>
          </CardHeader>
          {/* {shouldShowCardActions && (
            <CardFooter className="p-3 pt-0">
              <Button variant="outline" size="sm" className="w-full h-7 text-xs">
                Action
              </Button>
            </CardFooter>
            )} */}
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem onClick={handleDeleteTask}>Xóa công việc</ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default CardItem
