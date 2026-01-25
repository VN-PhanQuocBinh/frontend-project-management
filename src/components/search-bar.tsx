import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const recentBoards = [
    {
      id: 1,
      name: "Nguyên lý xây dựng phần mềm",
      workspace: "Không gian làm việc Trello",
      color: "bg-yellow-600",
    },
    {
      id: 2,
      name: "Client Workflow Management",
      workspace: "Trello Templates",
      color: "bg-yellow-600",
    },
    {
      id: 3,
      name: "Không có tiêu đề",
      workspace: "Không gian làm việc Trello",
      color: "bg-blue-600",
    },
  ];

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef} className="flex-1 relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Tìm kiếm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Search Popup */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg rounded-md border border-gray-200 z-50">
          {/* Recent Boards */}
          <div className="py-2">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
              Các bảng thông tin gần đây
            </div>
            {recentBoards.map((board) => (
              <button
                key={board.id}
                className="w-full px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-3"
                onClick={() => {
                  // Handle board selection
                  setIsOpen(false);
                }}
              >
                <div className={`w-10 h-8 ${board.color} rounded flex-shrink-0`}></div>
                <div className="text-left flex-1">
                  <div className="text-sm font-medium text-gray-900">{board.name}</div>
                  <div className="text-xs text-gray-600">{board.workspace}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
