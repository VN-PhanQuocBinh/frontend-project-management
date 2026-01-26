import Card from './card/card'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useMemo } from 'react'
import { type Card as CardType } from '@/types/project'

interface IProps {
  cards: CardType[]
}

function ListCards({ cards }: IProps) {
  const cardIds = useMemo(() => {
    return cards.map((card) => card._id)
  }, [cards])

  // const cardIds = cards.map((card) => card._id)

  return (
    <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
      <div className='flex flex-col gap-1 overflow-x-hidden overflow-y-auto max-h-120'>
        {cards.map((card) => <Card key={card._id} card={card} />)}
      </div>
    </SortableContext>
  )
}

export default ListCards