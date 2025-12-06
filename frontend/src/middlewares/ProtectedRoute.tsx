import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const loading = useAuthStore((state) => state.loading);
  const user = useAuthStore((state) => state.user);
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const [start, setStart] = useState(true);
  console.log(user);
  console.log(accessToken);

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
        Loading...
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/auth/login" replace></Navigate>;
  }
  return <Outlet />;
};

export default ProtectedRoute;
