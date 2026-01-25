import axiosClient from "./axios-client";

import type { LoginPayload, LoginResponse } from "@/types/auth";

export const authApi = {
  login(payload: LoginPayload): Promise<LoginResponse> {
    return axiosClient.post("/auth/login", payload);
  },

  logout() {
    return axiosClient.post("/auth/logout");
  },
};
