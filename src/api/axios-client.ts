import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // handle global error
    if (error.response && error.response.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();
      window.location.href = "/login";
    }

    let message = error.message || "An error occurred. Please try again.";
    if (error.response?.data?.message) {
      message = error.response?.data?.message
    }

    toast.error(message)

    return Promise.reject(error);
  },
);

export default axiosClient;
