import { BASE_URL } from "@/config/env-vars";

export const subscribeNotification = (onMessage: any) => {
  const authStorage = localStorage.getItem("auth-storage");
  const id = JSON.parse(authStorage || "{}").state.user.id;
  const eventSource = new EventSource(`${BASE_URL}/notifications/subscribe` + `/${id}`, {
    withCredentials: true,
  });

  eventSource.onopen = (event) => {
    console.log("SSE connected! Event:", event);
  };

  eventSource.onmessage = (event) => {
    console.log("SSE general message received:", event.data);
  };

  eventSource.addEventListener("notification", (event) => {
    console.log("SSE notification specific event received:", event);
    const data = JSON.parse(event.data);
    onMessage("data", data);
  });

  eventSource.onerror = (error) => {
    console.error("SSE error occurred:", error);
    console.log("SSE EventSource readyState:", eventSource.readyState);
  };

  return eventSource;
};
