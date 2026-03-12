import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { MessageSquareText, LoaderCircle } from "lucide-react";
import type { Comment } from "@/types/comment";
import { Skeleton } from "@/components/ui/skeleton";
import { createComment, updateComment, deleteComment } from "@/api/comment.api";
import { useCallback, useRef, useState, useEffect, useMemo } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import useTaskComments from "@/hooks/use-task-comments";
import DeleteConfirmPopup from "./delete-confirm-popup";
import { BASE_URL } from "@/config/env-vars";
import UserAvatar from "@/components/user-avatar";

interface CommentSectionProps {
  taskId: string;
  className?: string;
}

interface CommentItemProps {
  comment: Comment;
  isOpeningEdit: boolean;
  isLoading: boolean;
  isMyComment: boolean;
  onToggleUpdateOpen?: () => void;
  onSave: (content: string) => void;
  onDelete: () => void;
}

function CommentItem({
  comment,
  isOpeningEdit,
  isLoading,
  isMyComment,
  onToggleUpdateOpen,
  onSave,
  onDelete,
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
    // Normalize date string to ensure it can be parsed correctly across different browsers
    const normalized = dateString.replace(/(\.\d{3})\d+/, "$1") + "Z"; // UTC -> UTC +7

    const date = new Date(normalized);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    console.log("Time difference in ms:", diffInMs);
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
      <UserAvatar username={comment.user.username} avatar={comment.user.avatar} size={32} />

      <div className="ml-2 space-y-1 w-full">
        <div>
          <span className="font-medium">{comment.user.username}</span>
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
            <div className="flex flex-row justify-start gap-2">
              <Button
                size="sm"
                className="rounded-sm min-w-16"
                onClick={() => onSave(editedContent)}
              >
                {isLoading ? <LoaderCircle className="animate-spin" /> : "Lưu"}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="rounded-sm"
                onClick={onToggleUpdateOpen}
              >
                Hủy bỏ thay đổi
              </Button>
            </div>
          </div>
        ) : (
          <div className="">
            <div className="rounded-sm bg-white shadow px-3 py-2 w-full">
              <p className=" text-sm">{comment.content}</p>
            </div>
            {isMyComment && (
              <div className="flex flex-row gap-2 mt-2 px-2">
                <button className="text-sm underline text-gray-500" onClick={handleOpenEditMode}>
                  Chỉnh sửa
                </button>
                <DeleteConfirmPopup isLoading={isLoading} onDelete={onDelete}>
                  <button className="text-sm underline text-gray-500">Xóa</button>
                </DeleteConfirmPopup>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CommentSection({ taskId, className }: CommentSectionProps) {
  const { user } = useAuthStore();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCallingApi, setIsCallingApi] = useState(false);
  const [isOpeningCreateComment, setIsOpeningCreateComment] = useState(false);
  const [currentCommentValue, setCurrentCommentValue] = useState("");
  const handleCommentAdded = useCallback((comment: Comment) => {
    console.log("New comment added:", comment);
  }, []);

  const handleCommentUpdated = useCallback((comment: Comment) => {
    console.log("Comment updated:", comment);
  }, []);

  const handleCommentDeleted = useCallback((commentId: string) => {
    console.log("Comment deleted:", commentId);
  }, []);

  const { comments, isLoading, setComments } = useTaskComments({
    taskId: taskId || "",
    wsUrl: `${BASE_URL}/ws`,
    onCommentAdded: handleCommentAdded,
    onCommentUpdated: handleCommentUpdated,
    onCommentDeleted: handleCommentDeleted,
  });
  const displayComments = useMemo(() => {
    return [...comments].reverse();
  }, [comments]);

  useEffect(() => {
    if (isOpeningCreateComment && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpeningCreateComment]);

  const handleAddComment = useCallback(async () => {
    setIsCallingApi(true);

    try {
      const response = await createComment({
        content: currentCommentValue,
        taskId,
        userId: user?.id || "",
      });

      setComments((prev) => [...prev, response]);

      setCurrentCommentValue("");
      setIsOpeningCreateComment(false);
      // toast.success("Comment added successfully");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsCallingApi(false);
    }
  }, [user, taskId, currentCommentValue]);

  const handleToggleUpdateOpen = (commentId: string) => {
    setEditingId((prev) => (prev === commentId ? null : commentId));
  };

  const toggleCreateComment = () => {
    setCurrentCommentValue("");
    setEditingId(null);
    setIsOpeningCreateComment((prev) => !prev);
  };

  const handleEditComment = useCallback(
    async (content: string) => {
      setIsCallingApi(true);

      try {
        if (!editingId) return;

        const response = await updateComment(editingId, content);
        setComments((prev) =>
          prev.map((comment) => (comment.id === editingId ? response : comment)),
        );
        toast.success("Comment updated successfully");
      } catch (error) {
        toast.error("Failed to update comment");
      } finally {
        setEditingId(null);
        setIsCallingApi(false);
      }
    },
    [editingId],
  );

  const handleDeleteComment = useCallback(async (commentId: string) => {
    setIsCallingApi(true);

    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      toast.success("Comment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete comment");
    } finally {
      setIsCallingApi(false);
    }
  }, []);

  return (
    <div className={cn("flex-1 bg-neutral-50 flex flex-col p-6 overflow-y-auto", className)}>
      <h3 className="text-lg font-semibold mb-4">
        <MessageSquareText className="inline-block mr-2 mb-1 h-5 w-5 text-gray-600" />
        <span>Nhận xét và hoạt động</span>
      </h3>

      <div className="space-y-2 border-b border-gray-300 pb-4">
        {isOpeningCreateComment ? (
          <>
            <Textarea
              ref={inputRef}
              value={currentCommentValue}
              placeholder="Viết bình luận..."
              className="min-h-[80px] max-h-36 bg-white border border-gray-300 disabled:opacity-50"
              disabled={isLoading}
              onChange={(e) => setCurrentCommentValue(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                className="min-w-16 rounded-sm"
                disabled={isLoading || currentCommentValue.trim() === ""}
                onClick={handleAddComment}
              >
                {isCallingApi ? <LoaderCircle className="animate-spin" /> : "Thêm"}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="min-w-16 rounded-sm"
                disabled={isLoading}
                onClick={toggleCreateComment}
              >
                Hủy bỏ
              </Button>
            </div>
          </>
        ) : (
          <div
            onClick={toggleCreateComment}
            className="rounded-sm bg-white shadow px-3 py-2 w-full cursor-pointer"
          >
            <p className=" text-sm">Viết bình luận...</p>
          </div>
        )}
      </div>
      <div className="pt-4 overflow-y-auto custom-scrollbar pr-3">
        {isLoading ? (
          <>
            <Skeleton className="w-full h-16 mb-4" />
            <Skeleton className="w-full h-16 mb-4" />
            <Skeleton className="w-full h-16 mb-4" />
          </>
        ) : displayComments.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <MessageSquareText className="inline-block mb-2 h-8 w-8 text-gray-400" />
            <p className="text-sm">Chưa có nhận xét nào</p>
          </div>
        ) : (
          displayComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isOpeningEdit={editingId === comment.id}
              isLoading={isCallingApi}
              isMyComment={comment.user.id === user?.id}
              onToggleUpdateOpen={() => handleToggleUpdateOpen(comment.id)}
              onSave={handleEditComment}
              onDelete={() => handleDeleteComment(comment.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default CommentSection;
