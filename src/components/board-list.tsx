import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Board {
  id: string;
  title: string;
  createdBy: {
    name: string;
    avatar?: string;
  };
  color?: string;
}

interface BoardListProps {
  className?: string;
  boards: Board[];
  onBoardClick?: (boardId: string) => void;
}

const BoardItem = ({ board, onClick }: { board: Board; onClick?: (boardId: string) => void }) => {
  return (
    <button
      key={board.id}
      onClick={() => onClick?.(board.id)}
      className="w-full p-4 bg-white border group border-gray-200 rounded-lg hover:bg-gray-50 shadow-md transition-all text-left"
    >
      {/* Title */}
      <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-800 mb-2">
        {board.title}
      </h3>

      {/* Creator Info */}
      <div className="flex items-center gap-2">
        {board.createdBy.avatar ? (
          <img
            src={board.createdBy.avatar}
            alt={board.createdBy.name}
            className="w-5 h-5 rounded-full"
          />
        ) : (
          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-3 h-3 text-gray-600" />
          </div>
        )}
        <span className="text-sm text-gray-600">{board.createdBy.name}</span>
      </div>
    </button>
  );
};

const BoardList = ({ boards, className, onBoardClick }: BoardListProps) => {
  return (
    <div className={cn("space-y-3 overflow-y-auto custom-scrollbar pr-2", className)}>
      {boards.map((board) => (
        <BoardItem key={board.id} board={board} onClick={onBoardClick} />
      ))}
    </div>
  );
};

export default BoardList;
