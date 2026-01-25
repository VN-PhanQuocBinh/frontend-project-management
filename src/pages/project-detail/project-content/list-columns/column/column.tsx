import { useState } from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCut from '@mui/icons-material/ContentCut'
import Cloud from '@mui/icons-material/Cloud'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import AddCardIcon from '@mui/icons-material/AddCard'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import ClearIcon from '@mui/icons-material/Clear'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import ListCards from './ListCards/ListCards'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'
import { createNewCardAPI, deleteColumnDetailsAPI, updateColumnDetailsAPI } from '~/apis'
import {
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { cloneDeep } from 'lodash'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'


function Column({ column }) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

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

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const orderedCards = column.cards
  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => {
    setOpenNewCardForm(!openNewCardForm)
    setNewCardTitle('')
  }

  const [newCardTitle, setNewCardTitle] = useState('')

  const handleKeydown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault() // Thêm dòng này để khi Enter không bị nhảy dòng
      if (!event.target?.value) return

      addNewCard()
    }
  }

  const addNewCard = async () => {
    if (!newCardTitle) {
      toast.error('Please enter Card title!', { position: 'bottom-right' })
      return
    }
    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }

    // gọi api tạo mới column và làm lại dữ liệu State Board
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    // tự làm lại state Board thay vì gọi lại fetchBoardAPI
    // const newBoard = { ...board }
    // Tương tự createNewColumn, chỗ này phải dùng deep copy (cloneDeep)
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find((column) => column._id === createdCard.columnId)
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
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    toggleOpenNewCardForm()
    setNewCardTitle('')
  }

  const confirmDeleteColumn = useConfirm()
  // Xử lý xóa Column và Cards bên trong nó
  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      description: 'This action will permanently delete your Column and its Cards! Are you sure?',
      title: 'Delete Column?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(() => {
      // Xử lý xóa Column và Cards bên trong nó
      // Update cho chuẩn dữ liệu state Board
      const newBoard = { ...board }
      // Không vi phạm Immutability của Redux
      newBoard.columns = newBoard.columns.filter((c) => c._id !== column._id)
      newBoard.columnOrderIds = newBoard.columnOrderIds.filter((_id) => _id !== column._id)
      // setBoard(newBoard)
      dispatch(updateCurrentActiveBoard(newBoard))
      // Gọi API
      deleteColumnDetailsAPI(column._id)
        .then((res) => {
          toast.success(res?.deleteResult)
        })
      // updateBoardDetailsAPI(newBoard._id, { columnOrderIds: newBoard.columnOrderIds })
    }).catch(() => {})
  }

  const onUpdateColumnTitle = (newTitle) => {
    // Gọi API update column và xử lý dữ liệu board trong Redux
    updateColumnDetailsAPI(column._id, { title: newTitle }).then(() => {
      const newBoard = cloneDeep(board)
      const columnToUpdate = newBoard.columns.find((c) => c._id === column._id)
      if (columnToUpdate) columnToUpdate.title = newTitle
      // setBoard(newBoard)
      dispatch(updateCurrentActiveBoard(newBoard))
    })
  }

  // Bọc Box ở trong thẻ div và set chiếu cao div là 100% để kéo không bị bug
  return (
    <div ref={setNodeRef} style={dndKitColumnStyles}>
      <Box
        {...attributes}
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) =>
            theme.palette.mode === 'light' ? '#ebecf0' : '#333643',
          ml: 2,
          pr: '3px',
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) =>
            `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
        }}
      >
        <Box
          sx={{
            height: (theme) => theme.trello.columnHeaderHeight,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* <Typography sx={{ fontWeight: 'bold', cursor: 'pointer' }}>
            {column?.title}
          </Typography> */}
          <ToggleFocusInput
            value={column?.title}
            onChangedValue={onUpdateColumnTitle}
            data-no-dnd="true"
          />
          <Box>
            <Tooltip title="More options">
              <ExpandMoreIcon
                sx={{ color: 'text.primary', cursor: 'pointer' }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown'
              }}
            >
              <MenuItem
                onClick={toggleOpenNewCardForm}
                sx={{
                  '&:hover': {
                    color: 'success.light',
                    '.add-card-icon': {
                      color: 'success.light'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <AddCardIcon className="add-card-icon" fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCopyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentPasteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={handleDeleteColumn}
                sx={{
                  '&:hover': {
                    color: 'warning.dark',
                    '.delete-icon': {
                      color: 'warning.dark'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <DeleteIcon className="delete-icon" fontSize="small" />
                </ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        <ListCards cards={orderedCards} />
        <Box
          sx={{
            height: (theme) => theme.trello.columnFooterHeight,
            p: 2
          }}
        >
          {!openNewCardForm ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Button
                startIcon={<AddCardIcon />}
                onClick={toggleOpenNewCardForm}
              >
                Add new card
              </Button>
              <Tooltip title="Drag to move">
                <DragIndicatorIcon sx={{ cursor: 'grab', '&:active': { cursor: 'grabbing' } }} />
              </Tooltip>
            </Box>
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <TextField
                data-no-dnd="true"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                onKeyDown={handleKeydown}
                label="Enter card title"
                type="text"
                size="small"
                variant="outlined"
                autoFocus
                sx={{
                  '& label': { color: 'text.primary' },
                  '& input': {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark' ? '#333643' : 'white'
                  },
                  '& label.Mui-focused': {
                    color: (theme) => theme.palette.primary.main
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: (theme) => theme.palette.primary.main
                    },
                    '&:hover fieldset': {
                      borderColor: (theme) => theme.palette.primary.main
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: (theme) => theme.palette.primary.main
                    }
                  },
                  '.MuiOutlinedInput-input': {
                    borderRadius: 1
                  }
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  className="interceptor-loading"
                  data-no-dnd="true"
                  onClick={addNewCard}
                  variant="contained"
                  color="success"
                  size="small"
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': {
                      bgcolor: (theme) => theme.palette.success.main
                    }
                  }}
                >
                  Add
                </Button>
                <ClearIcon
                  onClick={toggleOpenNewCardForm}
                  fontSize="small"
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    // pointerEvents: searchValue ? 'unset' : 'none',
                    cursor: 'pointer'
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  )
}

export default Column
