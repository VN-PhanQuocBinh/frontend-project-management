import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/main-layout";
import NoSidebar from "@/layouts/no-sidebar";

import ProjectDetail from "@/pages/project-detail/_id";
import Home from "@/pages/home-page";

import LoginPage from "@/pages/login-page";
import RegisterPage from "@/pages/register-page";

import { AuthGuard } from "@/components/auth-guard";
import { Button } from "@/components/ui/button";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <AuthGuard requireAuth={false}>
        <LoginPage />
      </AuthGuard>
    ),
  },
  {
    path: "/register",
    element: (
      <AuthGuard requireAuth={false}>
        <RegisterPage />
      </AuthGuard>
    ),
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <AuthGuard>
            <Home />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: "*",
    element: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600 mb-4">Trang không tồn tại</p>
          <a href="/" className="text-blue-600 hover:underline">
            <Button variant="primary">Quay về trang chủ</Button>
          </a>
        </div>
      </div>
    ),
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
