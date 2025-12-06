import type { User } from "./user.types.ts";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  setAccessToken: (token: string | null) => void;
  setUser: (user: User) => void;
  clearState: () => void;

  login: (data: LoginPayload) => Promise<{ isSuccess: boolean }>;
  register: (data: RegisterPayload) => Promise<{ isSuccess: boolean }>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  refreshToken: () => Promise<void>;
}
