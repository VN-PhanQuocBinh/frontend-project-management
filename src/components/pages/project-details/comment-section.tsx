import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { MessageSquareText, LoaderCircle } from "lucide-react";
import type { Member } from "./detail-modal";
import { type Comment } from "@/hooks/use-task-comments";
import { Skeleton } from "@/components/ui/skeleton";
import { createComment, updateComment } from "@/api/comment.api";
import { useCallback, useRef, useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

interface CommentSectionProps {
  taskId: string;
  comments: Comment[];
  className?: string;
  isLoading?: boolean;
}

interface CommentItemProps {
  comment: Comment;
  isOpeningEdit: boolean;
  isEditing: boolean;
  onToggleUpdateOpen?: () => void;
  onSave: (content: string) => void;
}

const avatarColors = [
  {
    bg: "bg-red-500",
    text: "text-white",
  },
  {
    bg: "bg-green-500",
    text: "text-white",
  },
  {
    bg: "bg-blue-500",
    text: "text-white",
  },
  {
    bg: "bg-yellow-500",
    text: "text-white",
  },
  {
    bg: "bg-purple-500",
    text: "text-white",
  },
  {
    bg: "bg-pink-500",
    text: "text-white",
  },
];

function CommentItem({
  comment,
  isOpeningEdit,
  isEditing,
  onToggleUpdateOpen,
  onSave,
}: CommentItemProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [editedContent, setEditedContent] = useState(comment.content);

  useEffect(() => {
    if (isOpeningEdit && inputRef.current) {
      const textarea = inputRef.current;
      const length = textarea.value.length;

      // Set focus
      textarea.focus();

      // Đặt cursor ở cuối
      textarea.setSelectionRange(length, length);
    }
  }, [isOpeningEdit]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  const handleOpenEditMode = () => {
    setEditedContent(comment.content);
    onToggleUpdateOpen?.();

    inputRef.current?.focus();
  };

  return (
    <div className="mb-4 flex">
      <div>
        <Avatar className="size-8">
          <AvatarImage src={comment.userId} className="" />
          <AvatarFallback className={cn("bg-purple-500 text-white")}>
            <span className={cn("text-white")}>{comment.username[0].toUpperCase()}</span>
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="ml-2 space-y-1 w-full">
        <div>
          <span className="font-medium">{comment.username}</span>
          <span className="ml-2 text-xs text-gray-500">{formatDate(comment.createdDate)}</span>
        </div>

        {isOpeningEdit ? (
          <div className="space-y-2">
            <Textarea
              className="min-h-[80px]"
              ref={inputRef}
              autoFocus
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex flex-row-reverse justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                className="rounded-sm"
                onClick={onToggleUpdateOpen}
              >
                Hủy bỏ thay đổi
              </Button>
              <Button
                size="sm"
                className="rounded-sm min-w-16"
                onClick={() => onSave(editedContent)}
              >
                {isEditing ? <LoaderCircle className="animate-spin" /> : "Lưu"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="">
            <div className="rounded-sm bg-white shadow px-3 py-2 w-full">
              <p className=" text-sm">{comment.content}</p>
            </div>
            <div className="flex flex-row gap-2 mt-2 px-2">
              <button className="text-sm underline text-gray-500" onClick={handleOpenEditMode}>
                Edit
              </button>
              <button className="text-sm underline text-gray-500">Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CommentSection({ taskId, comments, className, isLoading }: CommentSectionProps) {
  const { user } = useAuthStore();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddComment = useCallback(async () => {
    try {
      if (!inputRef.current) return;

      const content = inputRef.current.value.trim();
      if (!content) return;

      await createComment({
        content,
        taskId,
        userId: user?.id || "",
      });

      inputRef.current.value = "";
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  }, [user, taskId]);

  const handleToggleUpdateOpen = (commentId: string) => {
    setEditingId((prev) => (prev === commentId ? null : commentId));
  };

  const handleSaveComment = useCallback(
    async (content: string) => {
      setIsEditing(true);

      try {
        if (!editingId) return;

        await updateComment(editingId, content);
        toast.success("Comment updated successfully");
      } catch (error) {
        toast.error("Failed to update comment");
      } finally {
        setEditingId(null);
        setIsEditing(false);
      }
    },
    [editingId],
  );

  return (
    <div className={cn("flex-1 bg-neutral-50 flex flex-col p-6 overflow-y-auto", className)}>
      <h3 className="text-lg font-semibold mb-4">
        <MessageSquareText className="inline-block mr-2 mb-1 h-5 w-5 text-gray-600" />
        <span>Nhận xét và hoạt động</span>
      </h3>
      <div className="space-y-4">
        <Textarea
          ref={inputRef}
          placeholder="Viết bình luận..."
          className="min-h-[80px] max-h-36 bg-white border border-gray-300 disabled:opacity-50"
          disabled={isLoading}
        />
        <Button className="" disabled={isLoading} onClick={() => handleAddComment()}>
          Gửi
        </Button>
      </div>
      <div className="mt-6 overflow-y-auto custom-scrollbar pr-3">
        {isLoading ? (
          <>
            <Skeleton className="w-full h-16 mb-4" />
            <Skeleton className="w-full h-16 mb-4" />
            <Skeleton className="w-full h-16 mb-4" />
          </>
        ) : comments.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <MessageSquareText className="inline-block mb-2 h-8 w-8 text-gray-400" />
            <p className="text-sm">Chưa có nhận xét nào</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onToggleUpdateOpen={() => handleToggleUpdateOpen(comment.id)}
              onSave={handleSaveComment}
              isOpeningEdit={editingId === comment.id}
              isEditing={isEditing && editingId === comment.id}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default CommentSection;
