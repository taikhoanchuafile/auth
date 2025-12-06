import { authService } from "@/services/authService.ts";
import type { AuthState } from "@/types/auth.types.ts";
import { useNavigate } from "react-router";

import { toast } from "react-toastify";
import { create } from "zustand";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),
  clearState: () => set({ accessToken: null, user: null, loading: false }),

  fetchMe: async () => {
    try {
      // Lấy user từ server và Lưu user vảo store
      const res = await authService.me();
      get().setUser(res.data.user);
    } catch (error) {
      console.log(error);
      set({ user: null, accessToken: null });
      toast.error("Lỗi khi tải dữ liệu người dùng, hãy thử lại!");
    }
  },

  login: async (data) => {
    try {
      set({ loading: true });
      // lấy accessToken từ server và lưu vào store
      const res = await authService.login(data);
      get().setAccessToken(res.data.accessToken);

      // Tải dữ liệu người dùng lên
      await get().fetchMe();

      // thông báo
      toast.success("Đăng nhập thành công");

      return { isSuccess: true };
    } catch (error) {
      console.log(error);
      toast.error("Đăng nhập không thành công!");
      return { isSuccess: true };
    } finally {
      set({ loading: false });
    }
  },

  register: async (data) => {
    try {
      set({ loading: true });

      await authService.register(data);

      toast.success("Đăng ký thành công!");

      return { isSuccess: true };
    } catch (error) {
      console.log(error);
      toast.error("Đăng ký không thành công, hãy thử lại!");
      return { isSuccess: false };
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    try {
      set({ loading: true });
      // Xóa db + cookie
      await authService.logout();

      // Cho toàn bộ về mặc định
      get().clearState();
    } catch (error) {
      set({ accessToken: null, user: null });
    } finally {
      set({ loading: false });
    }
  },
  refreshToken: async () => {
    try {
      set({ loading: true });
      const { user, fetchMe, setAccessToken } = get();

      const res = await authService.refresh();
      setAccessToken(res.data.accessToken);

      if (!user) {
        await fetchMe();
      }
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
}));
