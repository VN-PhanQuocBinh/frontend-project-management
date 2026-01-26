import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

export default function NoSidebar() {
  return (
    <>
      <Toaster />
      <header className="h-navbar-height bg-[#ecc536] border-b border-b-[#172b4d23]">Header</header>
      <main className="h-project-height bg-[#ecc536] overflow-x-hidden">
        <Outlet />
      </main>
    </>
  );
}
