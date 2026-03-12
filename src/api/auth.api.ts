import axiosClient from "./axios-client";

import type { LoginPayload, LoginResponse } from "@/types/auth";

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await axiosClient.post("/auth/login", payload);
    return response.data;
  },

  async register(payload: {
    username: string;
    email: string;
    password: string;
  }) {
    const response = await axiosClient.post("/auth/register", payload);
    return response.data;
  },

  async changePassword(payload: { oldPassword: string; newPassword: string }) {
    const response = await axiosClient.post("/auth/change-password", payload);
    return response.data;
  },

  async getCurrentUser() {
    const response = await axiosClient.get("/auth/me");
    return response.data;
  },

  logout() {
    return axiosClient.post("/auth/logout");
  },
};
