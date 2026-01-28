import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/layouts/header";

export default function NoSidebar() {
  return (
    <>
      <Toaster />
      <Header />
      <main className="h-project-height bg-gray-200 overflow-x-hidden">
        <Outlet />
      </main>
    </>
  );
}
