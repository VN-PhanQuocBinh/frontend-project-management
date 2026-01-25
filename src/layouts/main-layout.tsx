import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

export default function MainLayout() {
  return (
    <>
      <Toaster />
      <header>Header</header>
      <main>
        <Outlet />
      </main>
      <footer>Footer</footer>
    </>
  );
}
