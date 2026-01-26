import { useState } from 'react'
// import { createNewCardAPI, deleteColumnDetailsAPI, updateColumnDetailsAPI } from '~/apis'
// import {
//   updateCurrentActiveBoard,
//   selectCurrentActiveBoard
// } from '~/redux/activeBoard/activeBoardSlice'
// import { useDispatch, useSelector } from 'react-redux'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
// import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import ListCards from './list-cards/list-cards'
import type { Column as ColumnType, Card as CardType } from '@/types/project'
import { Button } from '@/components/ui/button'
import { CirclePlus, Ellipsis, GripVertical, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useProjectStore } from '@/stores/project-store'
import { toast } from 'sonner'
import { cloneDeep } from 'lodash'
import ToggleFocusInput from '@/components/toggle-focus-input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface IProps {
  column: ColumnType
}

function Column({ column }: IProps) {
  const { currentActiveProject, setCurrentActiveProject } = useProjectStore()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column._id,
    data: { ...column }
  })
  // Nếu sử dụng CSS.Transform như docs sẽ lỗi kiểu stretch
  const dndKitColumnStyles = {
    touchAction: 'none', // Dành cho pointer event dạng pointer sensor
    transform: CSS.Translate.toString(transform),
    transition,
    // Chiều cao phải luôn 100% vì nếu không sẽ lỗi lúc kéo column, kết hợp với {...listeners} ở Box chứ không phải div
    height: '100%',
    opacity: isDragging ? '0.5' : undefined
  }

  const orderedCards: CardType[] = column.cards
  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => {
    setOpenNewCardForm(!openNewCardForm)
    setNewCardTitle('')
  }

  const [newCardTitle, setNewCardTitle] = useState('')

  // const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key === 'Enter' && !event.shiftKey) {
  //     event.preventDefault() // Thêm dòng này để khi Enter không bị nhảy dòng
  //     if (!(event.target as HTMLInputElement)?.value) return

  //     addNewCard()
  //   }
  // }

  const addNewCard = async () => {
    if (!newCardTitle) {
      toast("Vui lòng nhập tên thẻ", {
          description: "Không thể tạo thẻ với tên trống.",
        })
      return
    }
    // const newCardData = {
    //   title: newCardTitle,
    //   columnId: column._id
    // }

    // gọi api tạo mới column và làm lại dữ liệu State Board
    // const createdCard = await createNewCardAPI({
    //   ...newCardData,
    //   boardId: board._id
    // })

    console.log('Gọi API tạo mới card với title:', newCardTitle)
    const createdCard: CardType = {
      _id: `card-${Date.now()}`,
      title: newCardTitle,
      projectId: currentActiveProject?._id as string,
      columnId: column._id,
      description: '',
      attachments: [],
      comments: []
    }

    // tự làm lại state Board thay vì gọi lại fetchBoardAPI
    // const newBoard = { ...board }
    // Tương tự createNewColumn, chỗ này phải dùng deep copy (cloneDeep)
    const newProject = cloneDeep(currentActiveProject)
    const columnToUpdate = newProject?.columns.find((column) => column._id === createdCard.columnId)
    if (columnToUpdate) {
      // Trường hợp mảng cards rỗng
      if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        // Ngược lại
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    // // setBoard(newBoard)
    // dispatch(updateCurrentActiveBoard(newBoard))
    setCurrentActiveProject(newProject as typeof currentActiveProject)

    toggleOpenNewCardForm()
    setNewCardTitle('')
  }

  // Xử lý xóa Column và Cards bên trong nó
  const handleDeleteColumn = () => {
      const newProject = { ...currentActiveProject }
      // Không vi phạm Immutability của Redux
      newProject.columns = newProject?.columns?.filter((c) => c._id !== column._id)
      newProject.columnOrderIds = newProject?.columnOrderIds?.filter((_id) => _id !== column._id)
      // setBoard(newBoard)
      setCurrentActiveProject(newProject as typeof currentActiveProject)
      // Gọi API
      console.log('Gọi API xóa column với id:', column._id)
  }

  const onUpdateColumnTitle = (newTitle: string) => {
    console.log('New title:', newTitle)
    // Gọi API update column và xử lý dữ liệu board trong Redux
    // updateColumnDetailsAPI(column._id, { title: newTitle }).then(() => {
    //   const newBoard = cloneDeep(board)
    //   const columnToUpdate = newBoard.columns.find((c) => c._id === column._id)
    //   if (columnToUpdate) columnToUpdate.title = newTitle
    //   // setBoard(newBoard)
    //   dispatch(updateCurrentActiveBoard(newBoard))
    // })
  }

  // Bọc Box ở trong thẻ div và set chiếu cao div là 100% để kéo không bị bug
  return (
    <div ref={setNodeRef} style={dndKitColumnStyles}>
      <div
        {...attributes}
        {...listeners}
        className="min-w-68 max-w-68 ml-2 pr-1 rounded-md h-fit bg-column"
      >
        <div
          className="p-2 flex items-center justify-between min-h-8"
        >
          <ToggleFocusInput value={column?.title}
            onChangedValue={onUpdateColumnTitle} />
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Ellipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Tùy chọn</DropdownMenuLabel>
                  <DropdownMenuItem onClick={handleDeleteColumn}>
                    Xóa cột
                    <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <ListCards cards={orderedCards} />
        <div
          className="p-2 min-h-8"
        >
          {!openNewCardForm ? (
            <div
              className="h-full flex items-center justify-between"
            >
              <Button
                onClick={toggleOpenNewCardForm}
                variant="ghost"
              >
                <CirclePlus />
                Add new card
              </Button>
              {/* <Tooltip title="Drag to move">
                <DragIndicatorIcon sx={{ cursor: 'grab', '&:active': { cursor: 'grabbing' } }} />
              </Tooltip> */}
              <GripVertical className='cursor-grab' />
            </div>
          ) : (
            <div
              className="h-full flex items-center gap-1"
            >
              <Input autoFocus value={newCardTitle} onChange={(e) => setNewCardTitle(e.target.value)} />
              <div className="flex items-center gap-1">
                <Button onClick={addNewCard}>
                  Add
                </Button>
                <X
                  onClick={toggleOpenNewCardForm}
                  className='cursor-pointer'
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Column
