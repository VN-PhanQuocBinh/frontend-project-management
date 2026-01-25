import type { Column as ColumnType, Project } from '@/types/project'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { mockData } from '@/api/mock-data'
import React, { useState } from 'react'
import { cloneDeep } from 'lodash'
import { generatePlaceholderCard } from '@/utils/formatters'
import type { UniqueIdentifier } from '@dnd-kit/core'
import Column from './column/column'
import { Button } from '@/components/ui/button'
import { CirclePlus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface IProps {
  columns: ColumnType[]
}

function ListColumns({ columns }: IProps) {
  // const dispatch = useDispatch()
  const project: Project = mockData.project  // giả sử lấy project đầu tiên từ mockData

  // SortableContent yêu cầu items dạng ['id-1', 'id-2'] chứ không phải [{id: 'id-1', id: 'id-2'}]
  // nếu không đúng thì vẫn kéo thả được nhưng không có animation
  const [openNewColumnForm, setOpenNewColumnForm] = useState<boolean>(false)
  const [newColumnTitle, setNewColumnTitle] = useState<string>('')
  const toggleOpenNewColumnForm = () => {
    setOpenNewColumnForm(!openNewColumnForm)
    setNewColumnTitle('')
  }

  const addNewColumn = async () => {
    if (!newColumnTitle) {
      // không cho tạo nếu title trống
      return
    }

    const newColumnData = {
      title: newColumnTitle
    }

    // gọi API tạo mới column và làm lại dữ liệu State Board
    // const createdColumn = await createNewColumnAPI({
    //   ...newColumnData,
    //   boardId: board._id
    // })

    // createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    // createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // tự làm lại state Board thay vì gọi lại fetchBoardAPI
    /**
     * Đoạn này sẽ dính lỗi object is not extensible bởi dù đã copy/clone giá trị newBoard nhưng bản chất của
     * spread operator là Shallow Copy/Clone nên dính phải rules Immutability trong Redux Toolkit, không được
     * dùng hàm push (sửa giá trị trực tiếp), cách đơn giản nhanh gọn nhất ở trường hợp này của  chúng ta là
     * dùng tới Deep Copy/Clone toàn bộ cái Board cho dễ hiểu và code ngắn gọn
     */
    // const newBoard = { ...board }
    // const newBoard = cloneDeep(board)
    // newBoard.columns.push(createdColumn)
    // newBoard.columnOrderIds.push(createdColumn._id)

    /**
     * Ngoài cách đó ra thì vẫn có thể dùng array.concat thay cho push như docs của Redux Toolkit ở trên vì push
     * như đã nói nó sẽ thay đổi giá trị mảng trực tiếp, còn thằng concat thì nó merge - ghép mảng lại và tạo ra
     * một mảng mới để chúng ta gán lại giá trị nên không vấn đề gì
     */
    // const newBoard = { ...board }
    // newBoard.columns = newBoard.columns.concat([createdColumn])
    // newBoard.columnOrderIds = newBoard.columnOrderIds.concat([createdColumn._id])

    // setBoard(newBoard)
    // Cập nhật dữ liệu trong Redux (Redux store)
    // dispatch(updateCurrentActiveBoard(newBoard))

    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }

  const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault() // Thêm dòng này để khi Enter không bị nhảy dòng
      if (!(event.target as HTMLInputElement)?.value) return

      addNewColumn()
    }
  }

  // const columnIds = useMemo(() => {
  //   return columns?.map((column) => column._id)
  // }, [columns])

  const columnIds: UniqueIdentifier[] = columns?.map((column) => column._id)

  return (
    <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
      <div className="w-full h-full flex overflow-x-auto overflow-y-hidden py-2">
        {columns?.map((column) => <Column key={column._id} column={column} />)}
        {!openNewColumnForm
          ? <div className="w-60 min-w-60 mx-2 rounded-md h-fit">
            
            <Button
              onClick={toggleOpenNewColumnForm}
              className="w-full"
            >
              <CirclePlus />
              Add new column
            </Button>
          </div>
          : <div className="min-w-60 max-w-60 mx-2 p-1 rounded-md h-fit bg-white/25 flex flex-col gap-1">
            <Input
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              onKeyDown={handleKeydown}
              type="text"
              autoFocus
            />
            <div className="flex items-center gap-1">
              <Button
                className="interceptor-loading"
                onClick={addNewColumn}
              >
                Add column
              </Button>
              <X
                onClick={toggleOpenNewColumnForm}
              />
            </div>
          </div>
        }
      </div>
    </SortableContext>
  )
}

export default ListColumns