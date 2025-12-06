import api from "@/api/axios.ts";
import type { LoginPayload, RegisterPayload } from "@/types/auth.types";

export const authService = {
  login: async (payload: LoginPayload) => {
    return await api.post("/auth/login", payload); // accestoken
  },
  register: async (payload: RegisterPayload) => {
    return await api.post("/auth/register", payload);
  },
  logout: async () => {
    return await api.post("/auth/logout");
  },
  me: async () => {
    return await api.get("/users/me");
  },
  refresh: async () => {
    return await api.post("/auth/refresh-token");
  },
};
