import api from "@/api/axios";
import { Button } from "@/components/ui/button";

import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "react-toastify";

const Home = () => {
  const logout = useAuthStore((state) => state.logout);

  const handleClick = async () => {
    try {
      await api.get("/users/test");
      toast.success("Access token vẫn còn");
    } catch (error) {
      console.log(error);
      toast.error("Access token hết hạn");
    }
  };

  const handleClickOut = async () => {
    await logout();
    toast.success("Đăng xuất thành công!");
  };

  return (
    <div className="fex flec-col gap-4">
      <h1>Trang Home</h1>
      <p>
        Access token sẽ hết hạn trong{" "}
        <span className="text-xl text-red-600">5 giây</span>, ấn nút "Kiểm tra
        token" trước và sau 5 giây để kiểm tra token
      </p>
      <Button onClick={handleClick} variant="destructive">
        Kiểm tra token
      </Button>
      <br />
      <Button onClick={handleClickOut} variant="outline">
        Log Out
      </Button>
    </div>
  );
};

export default Home;
