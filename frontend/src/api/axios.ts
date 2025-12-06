import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL,
  withCredentials: true, // luôn luôn gửi cookie mọi request
});

/**
 * Tự động gắn accessToken khi gửi request lên
 */
// chặn request lại, gắn accesstoken và cho request tiếp tục
api.interceptors.request.use((config) => {
  // const accessToken = useAuthStore(state => state.accessToken)
  //   => cách trên sẽ tự re-render lại nên
  //  cách trên chỉ dùng trong FILE.tsx(react component)
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

/**
 * Tự động refresh token
 */
// Tạo biến đánh dấu trạng thái
let isRefreshing = false; // có đang ở trạng thái refreh ? Ko
let queue: any[] = []; // mảng chứa request chờ

// chặn response phản hòi xuống
api.interceptors.response.use(
  // Nếu success thì trả về res
  (res) => res,

  // Nếu fail thì xử lý
  async (err) => {
    // lấy request fail đầu tiên
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      console.log("đã vô phần refresh");

      if (isRefreshing) {
        // request 2,3,4...sẽ tạo thành promise chờ
        // callback sẽ lưu vào queue
        return new Promise((resolve) => {
          queue.push((token: string) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          });
        });
      }

      //Request đầu tiền đánh dấu đang ở trạng thái refresh và đã thử qua 1 lần
      original._retry = true;
      isRefreshing = true;

      try {
        // Dùng axios , dùng api sẽ bị chặn vì gắn interceptors

        const res = await axios.post(
          `${baseURL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        console.log("2");

        // Lưu accessToken mới vào store
        useAuthStore.getState().setAccessToken(res.data.accessToken);
        console.log("3");
        //Sau khi có accessToken,
        //gắn lại token và chạy lại tất cả request nằm trong queue
        queue.forEach((cb) => cb(res.data.accessToken));
        queue = [];

        // Chạy lại request đầu tiên
        toast.warning("Access token đã được cấp mới!");
        return api(original);
      } catch (error) {
        //logout + thông báo + kết thúc promise fail
        useAuthStore.getState().logout();
        return Promise.reject(error);
      } finally {
        // đánh dấu đã refresh xong chờ đợt tiếp theo
        isRefreshing = false;
      }
    }

    toast.error(err.response?.data?.message || "Fail! Hãy kiểm tra lại!");
    return Promise.reject(err);
  }
);

export default api;
