import { type Column as ColumnType } from "@/types/project"

interface IProps {
  column: ColumnType
}

function Column({ column }: IProps) {
  return (
    <div>Column</div>
  )
}

export default Column