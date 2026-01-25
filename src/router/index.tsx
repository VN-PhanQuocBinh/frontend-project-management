import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/main-layout";
import Home from "@/pages/home";

import Login from "@/pages/login";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [{ path: "/", element: <Home /> }],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
