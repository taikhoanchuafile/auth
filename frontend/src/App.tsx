import { createBrowserRouter, RouterProvider } from "react-router";
import AppRouter from "./AppRouter";
import Home from "./pages/Home";
import AuthLayout from "./pages/AuthLayout";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ProtectedRoute from "./middlewares/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    Component: AppRouter,
    children: [
      {
        Component: ProtectedRoute,
        children: [
          {
            index: true,
            Component: Home,
          },
        ],
      },
      {
        path: "auth",
        Component: AuthLayout,
        children: [
          { path: "login", Component: Login },
          { path: "register", Component: Register },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
