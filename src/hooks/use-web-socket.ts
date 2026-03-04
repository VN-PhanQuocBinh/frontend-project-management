import { useEffect, useRef, useCallback, useState } from "react";
import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import { useAuthStore } from "@/stores/auth-store";
import { BASE_URL } from "@/config/env-vars";

interface UseWebSocketOptions {
  url: string;
  reconnectDelay?: number;
  debug?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

function useWebSocket({
  url,
  reconnectDelay = 5000,
  debug = false,
  onConnect,
  onDisconnect,
  onError,
}: UseWebSocketOptions) {
  const { token } = useAuthStore();
  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<Map<string, StompSubscription>>(new Map());
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log("token in useWebSocket:", token);

    const client = new Client({
      brokerURL: `${BASE_URL}/ws/websocket`,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: debug ? (str) => console.log(str) : undefined,
      onConnect: () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        onConnect?.();
      },
      onDisconnect: () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        onDisconnect?.();
      },
      onStompError: (frame) => {
        console.error("WebSocket error", frame);
        onError?.(frame);
      },
      onWebSocketError: (event) => {
        console.error("WebSocket error (low-level)", event);
      },
      onWebSocketClose: (event) => {
        console.error("WebSocket closed (low-level)", event);
      },
    });

    client.activate();
    console.log(client);
    clientRef.current = client;

    return () => {
      subscriptionRef.current?.forEach((subscription) => subscription.unsubscribe());
      subscriptionRef.current?.clear();
      client.deactivate();
    };
  }, [url, token]);

  const subscribe = useCallback((destination: string, callback: (message: IMessage) => void) => {
    if (!clientRef.current || !clientRef.current.connected) {
      console.warn("Client is not connected yet");
      return;
    }

    if (subscriptionRef.current?.has(destination)) {
      subscriptionRef.current.get(destination)?.unsubscribe();
    }

    const subscription = clientRef.current.subscribe(destination, callback);
    subscriptionRef.current?.set(destination, subscription);

    return () => {
      subscription.unsubscribe();
      subscriptionRef.current?.delete(destination);
    };
  }, []);

  const unsubscribe = useCallback((destination: string) => {
    const subscription = subscriptionRef.current?.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      subscriptionRef.current?.delete(destination);
    }
  }, []);

  return {
    isConnected,
    subscribe,
    unsubscribe,
  };
}

export default useWebSocket;
