import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/layouts/header";
import LeftSidebar from "@/components/layouts/left-sidebar";
import RightSidebar from "@/components/layouts/right-sidebar";

export default function MainLayout() {
  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <Toaster richColors />
      <Header />
      <main className="grow flex flex-row max-h-full w-full overflow-hidden">
        <LeftSidebar />
        <div className="grow h-full overflow-auto">
          <Outlet />
        </div>
        <RightSidebar />
      </main>
    </div>
  );
}
