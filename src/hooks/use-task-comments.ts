import { useState, useCallback, useEffect } from "react";
import useWebSocket from "./use-web-socket";
import type { IMessage } from "@stomp/stompjs";
import { getCommentsByTaskId } from "@/api/comment.api";
import { useAuthStore } from "@/stores/auth-store";
import type { Comment } from "@/types/comment";

export type CommentEventType = "COMMENT_CREATED" | "COMMENT_UPDATED" | "COMMENT_DELETED";

interface CommentEvent {
  actorId: string;
  type: CommentEventType;
  payload: Comment;
}

interface UseTaskCommentsOptions {
  taskId: string;
  wsUrl: string;
  onCommentAdded?: (comment: Comment) => void;
  onCommentUpdated?: (comment: Comment) => void;
  onCommentDeleted?: (commentId: string) => void;
}

function useTaskComments({
  taskId,
  wsUrl,
  onCommentAdded,
  onCommentUpdated,
  onCommentDeleted,
}: UseTaskCommentsOptions) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const { isConnected, subscribe } = useWebSocket({
    url: wsUrl,
    onConnect: () => {
      console.log("WebSocket connected, subscribing to task comments");
    },
    onError: (err) => {
      console.error("WebSocket error:", err);
    },
    debug: true,
  });

  const fetchComments = useCallback(async () => {
    if (!taskId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getCommentsByTaskId(taskId);
      setComments(response);
    } catch (err) {
      setError("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    if (!isConnected || !taskId) return;

    const unsubscribe = subscribe(`/topic/task/${taskId}/comments`, (message: IMessage) => {
      try {
        const data = JSON.parse(message.body);
        console.log("Received comment event:", data);
        const { type, payload, actorId }: CommentEvent = data;

        if (actorId === user?.id) {
          console.log("Ignoring comment event from self");
          return;
        }

        switch (type) {
          case "COMMENT_CREATED":
            setComments((prev) => {
              if (prev.some((c) => c.id === payload.id)) {
                return prev;
              }
              return [...prev, payload];
            });
            onCommentAdded?.(payload);
            break;
          case "COMMENT_UPDATED":
            setComments((prev) =>
              prev.map((comment) => (comment.id === payload.id ? payload : comment)),
            );
            onCommentUpdated?.(payload);
            break;
          case "COMMENT_DELETED":
            setComments((prev) => prev.filter((comment) => comment.id !== payload.id));
            onCommentDeleted?.(payload.id);
            break;

          default:
            console.warn("Unknown comment event type:", type);
        }
      } catch (err) {
        console.error("Failed to parse comment message:", err);
      }
    });

    return () => {
      unsubscribe?.();
    };
  }, [isConnected, taskId, subscribe, onCommentAdded, onCommentUpdated, onCommentDeleted]);

  return {
    comments,
    isConnected,
    isLoading,
    error,
    setComments,
    refetch: fetchComments,
  };
}

export default useTaskComments;
