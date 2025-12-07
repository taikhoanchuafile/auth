import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";

const AppRouter = () => {
  return (
    <div>
      <ToastContainer />

      <Outlet />
    </div>
  );
};

export default AppRouter;
