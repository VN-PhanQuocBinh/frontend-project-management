import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
// import { useDispatch } from 'react-redux'
// import { updateCurrentActiveCard, showModalActiveCard } from '~/redux/activeCard/activeCardSlice'
import type { Card as CardType } from '@/types/project'
import { Button } from "@/components/ui/button"
import {
  Card,
  // CardContent,
  // CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from '@/lib/utils'

interface IProps {
  card: CardType
}

function CardItem({ card }: IProps) {
  // const dispatch = useDispatch()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: card._id,
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

  const shouldShowCardActions =
  !!card?.memberIds?.length ||
  !!card?.comments?.length ||
  !!card?.attachments?.length

  const setActiveCard = () => {
    // Cập nhật activeCard trong Redux
    // dispatch(updateCurrentActiveCard(card))
    // Hiện modal
    // dispatch(showModalActiveCard())
  }

  return (
    <Card
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...listeners}
      onClick={setActiveCard}
      className={cn(card?.FE_PlaceholderCard ? 'hidden' : 'block')}
    >
      <CardHeader>
        <CardTitle>{card.title}</CardTitle>
        {/* <CardDescription>
          This card uses the small size variant.
        </CardDescription> */}
      </CardHeader>
      {/* <CardContent>
        <p>
          The card component supports a size prop that can be set to
          &quot;sm&quot; for a more compact appearance.
        </p>
      </CardContent> */}
      {shouldShowCardActions && (
        <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          Action
        </Button>
      </CardFooter>
      )}
    </Card>
  )
}

export default CardItem
