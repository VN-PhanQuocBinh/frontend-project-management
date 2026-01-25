import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/layouts/header";
import LeftSidebar from "@/components/layouts/left-sidebar";
import RightSidebar from "@/components/layouts/right-sidebar";

export default function MainLayout() {
  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <Toaster />
      <Header />
      <main className="grow flex flex-row max-h-full w-full">
        <LeftSidebar />
        <div className="grow h-full overflow-auto p-4">
          <Outlet />
        </div>
        <RightSidebar />
      </main>
    </div>
  );
}
