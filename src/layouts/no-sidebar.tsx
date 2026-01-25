import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

export default function NoSidebar() {
  return (
    <>
      <Toaster />
      <header className="h-navbar-height">Header</header>
      <main className="h-project-height bg-amber-100 overflow-hidden">
        <Outlet />
      </main>
    </>
  );
}
