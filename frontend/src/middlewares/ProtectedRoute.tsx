import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const loading = useAuthStore((state) => state.loading);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const [start, setStart] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!accessToken) {
        await refreshToken();
      }
      setStart(false);
    };
    init();
  }, []);

  if (start || loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        Đang tải trang....
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/auth/login" replace></Navigate>;
  }
  return <Outlet />;
};

export default ProtectedRoute;
