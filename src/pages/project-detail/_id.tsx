import { useEffect } from 'react'
import ProjectBar from './project-bar'
import ProjectContent from './project-content/project-content'
import {
  updateProjectDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI
} from '@/api/project.api'
import { type Card, type Column, type Project } from '@/types/project'
import { useParams } from 'react-router-dom'
import { useProjectStore } from '@/stores/project-store'
import type { UniqueIdentifier } from '@dnd-kit/core'
import { cloneDeep } from 'lodash'

function ProjectDetail() {
  const { fetchProjectDetailsAPI, setCurrentActiveProject, currentActiveProject } = useProjectStore()

  const project = currentActiveProject
  const { projectId } = useParams()

  useEffect(() => {
    fetchProjectDetailsAPI(projectId as UniqueIdentifier)
  }, [fetchProjectDetailsAPI, projectId])

  // Func này có nhiệm vụ gọi API và xử lý khi kéo thả boardColumns xong
  // Chỉ cần gọi API để cập nhật mảng columnOrderIds của Board chứa nó (thay đổi vị trí trong Board)
  const moveColumns = (dndOrderedColumns: Column[]) => {
    const dndOrderedColumnIds = dndOrderedColumns.map(c => c.id)
    const newProject = { ...project }
    /**
     * Trường hợp dùng spread operator này thì lại không sao bởi vì ở đây chúng ta không dùng push như ở trên
     * làm thay đổi trực tiếp kiểu mở rộng mảng, mà chỉ đang gán lại toàn bộ giá trị boardColumns và columnOrderIds
     * bằng 2 mảng mới. Tương tự như cách làm concat ở trường hợp createNewColumn
     */
    newProject.boardColumns = dndOrderedColumns
    newProject.columnOrderIds = dndOrderedColumnIds

    setCurrentActiveProject(newProject as Project)

    // Gọi API update Board
    updateProjectDetailsAPI(newProject.id as UniqueIdentifier, { columnOrderIds: newProject.columnOrderIds } as Project)
  }

  // Khi di chuyển Card trong cùng Column
  // Chỉ cần gọi API để cập nhật mảng taskOrderIds của Column chứa nó (thay đổi vị trí trong mảng)
  const moveCardInTheSameColumn = (dndOrderedCards: Card[] | undefined, dndOrderedCardIds: UniqueIdentifier[] | undefined, columnId: UniqueIdentifier | undefined) => {
    // Update cho chuẩn dữ liệu state Board
    /**
     * Cannot assign to read only property 'tasks' of object
     * Trường hợp Immutability ở đây đã đụng tới giá trị tasks đang được coi là chỉ đọc - read only (nested object)
     */
    // const newBoard = { ...board }
    const newProject = cloneDeep(project)
    const columnToUpdate = newProject?.boardColumns.find((column: Column) => column.id === columnId)
    if (columnToUpdate) {
      columnToUpdate.tasks = dndOrderedCards as Card[]
      columnToUpdate.taskOrderIds = dndOrderedCardIds as string[]
    }
    // setBoard(newBoard)
    setCurrentActiveProject(newProject as Project)
    // Gọi API update Column
    updateColumnDetailsAPI(columnId as UniqueIdentifier, { taskOrderIds: dndOrderedCardIds } as Column)
  }

  // Khi di chuyển Card sang Column khác:
  // B1: Cập nhật mảng taskOrderIds của Column ban đầu chứa nó (xóa id của Card ra khỏi mảng)
  // B2: Cập nhật mảng taskOrderIds của Column tiếp theo (thêm id của Card vào mảng)
  // B3: Cập nhật lại trường columnId của Card đã kéo
  const moveCardToDifferentColumn = (
    currentCardId: UniqueIdentifier | undefined,
    prevColumnId: UniqueIdentifier | undefined,
    nextColumnId: UniqueIdentifier | undefined,
    dndOrderedColumns: Column[]
  ) => {
    // console.log('currentCardId', currentCardId)
    // console.log('prevColumnId', prevColumnId)
    // console.log('nextColumnId', nextColumnId)
    // console.log('dndOrderedColumns', dndOrderedColumns)

    const dndOrderedColumnIds = dndOrderedColumns.map(c => c.id)
    // Không vi phạm Immutability của Redux
    const newProject = { ...project }
    newProject.boardColumns = dndOrderedColumns
    newProject.columnOrderIds = dndOrderedColumnIds
    // setBoard(newBoard)
    setCurrentActiveProject(newProject as Project)

    // Gọi API xử lý phía BE
    // mảng gửi về BE không được có placeholder
    let prevtaskOrderIds = dndOrderedColumns.find((column) => column.id === prevColumnId)?.taskOrderIds
    if (prevtaskOrderIds?.[0].includes('placeholder-card')) {
      prevtaskOrderIds = []
    }

    let nexttaskOrderIds = dndOrderedColumns.find((column) => column.id === nextColumnId)?.taskOrderIds
    if (nexttaskOrderIds?.[0].includes('placeholder-card')) {
      nexttaskOrderIds = []
    }
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevtaskOrderIds,
      nextColumnId,
      nexttaskOrderIds
    })
  }

  if (!project) {
    return <div>Loading...</div>
  }

  return (
    <div className='h-full'>
      <ProjectBar />
      <ProjectContent
        project={project as Project}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </div>
  )
}

export default ProjectDetail