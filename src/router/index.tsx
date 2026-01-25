import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/main-layout";
import Home from "@/pages/home";
import NoSidebar from "@/layouts/no-sidebar";

import Login from "@/pages/login";
import ProjectDetail from "@/pages/project-detail/_id";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [{ path: "/", element: <Home /> }],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <NoSidebar />,
    children: [
      {
        path: "/p/:projectId",
        element: <ProjectDetail />,
      },
    ],
  }
]);
