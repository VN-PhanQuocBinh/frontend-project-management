// import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectItem } from "@/types/project";
import randomColor from "randomcolor"

interface BoardListProps {
  className?: string;
  boards: ProjectItem[];
  onBoardClick?: (boardId: string) => void;
}

const BoardItem = ({ board, onClick }: { board: ProjectItem; onClick?: (boardId: string) => void }) => {
  const projectColor = randomColor()

  return (
    <div
      key={board.id}
      onClick={() => onClick?.(board.id)}
      className="w-full cursor-pointer bg-white group rounded-lg shadow-[0px_1px_1px_#1E1F2140,0px_0px_1px_#1E1F214F] hover:bg-gray-50 transition-all text-left overflow-hidden"
    >
      <div className="h-22 group-hover:brightness-75 transition-all" style={{ backgroundColor: projectColor }}></div>
      <div className="p-3 flex gap-2 items-center justify-between">
        {/* Title */}
        <span className="text-base text-gray-700">
          {board.name}
        </span>

        {/* Creator Info */}
        <span className="text-sm text-gray-600">{board.owner}</span>
      </div>
    </div>
  );
};

const BoardList = ({ boards, className, onBoardClick }: BoardListProps) => {
  return (
    <div className={cn("overflow-y-auto custom-scrollbar pr-2 grid grid-cols-4 gap-3 p-0.5", className)}>
      {boards.map((board: ProjectItem) => (
        <BoardItem key={board.id} board={board} onClick={onBoardClick} />
      ))}
    </div>
  );
};

export default BoardList;
