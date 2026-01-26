import ListColumns from './list-columns/list-columns'
import {
  DndContext,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  type CollisionDetection,
  type UniqueIdentifier,
  type Active,
  type Over
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '@/customLibs/DndKitSensors'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cloneDeep, isEmpty } from 'lodash'
import { arrayMove } from '@dnd-kit/sortable'
import { generatePlaceholderCard } from '@/utils/formatters'

import Column from './list-columns/column/column'
import Card from './list-columns/column/list-cards/card/card'
import { type Project, type Column as ColumnType, type Card as CardType } from '@/types/project'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
} as const

type ActiveDragItemType = typeof ACTIVE_DRAG_ITEM_TYPE[keyof typeof ACTIVE_DRAG_ITEM_TYPE] | null

interface ProjectContentProps {
  project: Project
  moveColumns: (dndOrderedColumns: ColumnType[]) => void
  moveCardInTheSameColumn: (
    dndOrderedCards: CardType[] | undefined,
    dndOrderedCardIds: UniqueIdentifier[] | undefined,
    columnId: UniqueIdentifier | undefined
  ) => void
  moveCardToDifferentColumn: (
    currentCardId: UniqueIdentifier | undefined,
    prevColumnId: UniqueIdentifier | undefined,
    nextColumnId: UniqueIdentifier | undefined,
    dndOrderedColumns: ColumnType[]
  ) => void
}

function ProjectContent({
  project,
  moveColumns,
  moveCardInTheSameColumn,
  moveCardToDifferentColumn
}: ProjectContentProps) {
  // New comment by quochoi227
  // Nếu dùng pointerSensor mặc định thì phải kết hợp thuộc tính touchAction: 'none', nhưng còn bug
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  // Yêu cầu di chuột 10px thì hiệu ứng mới được kích hoạt
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  // Yêu cầu chạm và giữ 250ms và dung sai 5px thì hiệu ứng mới được kích hoạt
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 50 } })

  // Ưu tiên sử dụng 2 sensor là mouseSensor và touchSensor để không bị bug
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState<ColumnType[]>([])

  // Cùng 1 thời điểm chỉ có 1 phần tử được kéo, column hoặc card
  const [activeDragItemId, setActiveDragItemId] = useState<UniqueIdentifier | null>(null)
  const [activeDragItemType, setActiveDragItemType] = useState<ActiveDragItemType>(null)
  const [activeDragItemData, setActiveDragItemData] = useState<ColumnType | CardType | null>(null)
  const [oldColumn, setOldColumn] = useState<ColumnType | null>(null)

  // điểm va chạm cuối cùng trước đó (xử lý thuật toán phát hiện va chạm)
  const lastOverId = useRef<UniqueIdentifier | null>(null)

  useEffect(() => {
    // Column đã được sắp xếp ở component cao nhất (_id.jsx) nên chỉ cần set thẳng, không cần sắp xếp lại
    setOrderedColumns(project.columns)
  }, [project])

  const findColumnByCardId = (cardId: UniqueIdentifier): ColumnType | undefined => {
    return orderedColumns.find((column) => column.cards.map((card) => card._id).includes(cardId as string))
  }

  const moveCardBetweenDifferentColumns = (
    overColumn: ColumnType,
    overCardId: UniqueIdentifier,
    active: Active,
    over: Over,
    activeColumn: ColumnType,
    activeDraggingCardId: UniqueIdentifier,
    activeDraggingCardData: CardType,
    triggerFrom: 'handleDragOver' | 'handleDragEnd'
  ): void => {
    let nextColumns: ColumnType[] = []
    
    setOrderedColumns((prevColumns) => {
      // tìm vị trí của active card sắp được thả
      const overCardIndex = overColumn.cards.findIndex((card) => card._id === overCardId)

      // đây là logic tính "cardIndex mới" (trên hoặc dưới của overCard) lấy chuẩn ra từ code của thư viện
      const isBelowOverItem =
        over && active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0

      const newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn.cards.length + 1
      // clone mảng orderedColumns ra 1 mảng mới
      nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find((column) => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find((column) => column._id === overColumn._id)
      if (nextActiveColumn) {
        // xóa card ra khỏi active column
        nextActiveColumn.cards = nextActiveColumn.cards.filter((card) => card._id !== activeDraggingCardId)

        nextActiveColumn.cards = nextActiveColumn.cards.filter((card) => !card.FE_PlaceholderCard)
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn as ColumnType)]
        }

        // cập nhật lại mảng cardsOrderIds
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map((card) => card._id)
      }

      if (nextOverColumn) {
        // kiểm tra xem card đang kéo có tồn tại trong overColumn hay chưa, nếu có thì cần phải xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter((card) => card._id !== activeDraggingCardId)
        // đối với trường hợp dragEnd thì phải cập nhật lại chuẩn dữ liệu columnId trong card sau khi kéo giữa 2 columns khác nhau
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        // thêm card đang kéo vào overColumn theo index mới
        nextOverColumn.cards.splice(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData
        )

        // cập nhật lại mảng cardsOrderIds
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map((card) => card._id)
      }

      return nextColumns
    })
    
    // Nếu func này được gọi từ handleDragEnd thì mới xử lý gọi API
    if (triggerFrom === 'handleDragEnd') {
      // Gọi lên hàm moveCardToDifferentColumn ở component cha cao nhất (_id.jsx)
      moveCardToDifferentColumn(activeDraggingCardId, oldColumn?._id, overColumn._id, nextColumns)
    }
  }

  const handleDragStart = (event: DragStartEvent): void => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current as ColumnType | CardType)

    if (event?.active?.data?.current?.columnId) {
      setOldColumn(findColumnByCardId(event?.active?.id) ?? null)
    }
  }

  const handleDragOver = (event: DragOverEvent): void => {
    // không làm gì nếu như đang kéo Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    const { active, over } = event
    // nếu kéo ra ngoài thì return
    if (!active || !over) return
    // card đang được kéo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // card được thay chỗ
    const { id: overCardId } = over
    // tìm 2 columns theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // nếu không tồn tại thì return để tránh crash
    if (!activeColumn || !overColumn) return
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData as CardType,
        'handleDragOver'
      )
    }
  }

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event
    if (!active || !over) return

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // card đang được kéo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // card được thay chỗ
      const { id: overCardId } = over
      // tìm 2 columns theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // nếu không tồn tại thì return để tránh crash
      if (!activeColumn || !overColumn) return
      // dùng oldColumn._id hoặc activeDragItemData.columnId được set từ lúc drag start
      if (oldColumn!._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData as CardType,
          'handleDragEnd'
        )
      } else {
        // xử lý kéo thả card trong cùng column
        const oldCardIndex = oldColumn?.cards?.findIndex((card) => card._id === activeDragItemId)
        const newCardIndex = overColumn?.cards?.findIndex((card) => card._id === overCardId)

        // dùng arrayMove cho card trong cùng column tương tự như kéo column trong cùng project
        const dndOrderedCards = arrayMove(oldColumn?.cards as CardType[], oldCardIndex as number, newCardIndex)
        const dndOrderedCardIds = dndOrderedCards.map((card) => card._id)
        setOrderedColumns((prevColumns) => {
          // clone mảng orderedColumns ra 1 mảng mới
          const nextColumns = cloneDeep(prevColumns)

          const targetColumn = nextColumns.find((column) => column._id === overColumn._id)
          if (targetColumn) {
            targetColumn.cards = dndOrderedCards
          }
          if (targetColumn) {
            targetColumn.cardOrderIds = dndOrderedCardIds
          }
          return nextColumns
        })
        moveCardInTheSameColumn(dndOrderedCards, dndOrderedCardIds, oldColumn?._id)
      }
    } else if (activeDragItemType == ACTIVE_DRAG_ITEM_TYPE.COLUMN && active.id !== over.id) {
      const oldColumnIndex = orderedColumns.findIndex((column) => column._id === active.id)
      const newColumnIndex = orderedColumns.findIndex((column) => column._id === over.id)
      // Dùng arrayMove của Dnd Kit để sắp xếp lại mảng ban đầu
      const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
      // const dndOrderedColumnsIds = dndOrderedColumns.map((column) => column._id)
      setOrderedColumns(dndOrderedColumns)
      // Xử lý gọi API
      moveColumns(dndOrderedColumns)
    }
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumn(null)
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  // custom lại chiến lược phát hiện va chạm
  const collisionDetectionStrategy: CollisionDetection = useCallback((args) => {
    // trường hợp kéo column thì dùng closestCorners là chuẩn nhất
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }

    // tìm những điểm giao nhau với con trỏ
    const pointerIntersections = pointerWithin(args)

    if (!pointerIntersections?.length) return []

    // thuật toán phát hiện va chạm sẽ trả về 1 mảng các va chạm ở đây
    const intersections = pointerIntersections?.length > 0 ? pointerIntersections : rectIntersection(args)
    // tìm overId đầu tiên cho các intersections ở trên
    let overId = getFirstCollision(intersections, 'id')
    if (overId) {
      // nếu overId là column thì sẽ tìm tới cardId gần nhất bên trong khu vực va chạm đó dựa vào
      // thuật toán phát hiện va chạm closestCenter hoặc closestCorners đều được. Tuy nhiên ở đây
      // dùng closestCorners sẽ mượt mà hơn
      const checkColumn = orderedColumns.find((column) => column._id === overId)

      if (checkColumn) {
        // console.log('-------------')
        // console.log('overId before:', overId)
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter((container) => {
            return (checkColumn?.cardOrderIds?.includes(container.id as string))
          })
        })[0]?.id
        // console.log('overId after:', overId)
        // console.log('-------------')
      }

      lastOverId.current = overId
      return [{ id: overId }]
    }

    // nếu overId là null thì return ref cuối cùng trước đó
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedColumns])

  return (
    <DndContext
      sensors={sensors}
      // collisionDetection={closestCorners}
      // nếu chỉ dùng closest corners thì sẽ bị lỗi flickering
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className='w-full h-project-content-height pb-1'>
        <ListColumns
          columns={orderedColumns}
        />
        <DragOverlay dropAnimation={dropAnimation}>
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData as ColumnType} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData as CardType} />}
        </DragOverlay>
      </div>
    </DndContext>
  )
}

export default ProjectContent
