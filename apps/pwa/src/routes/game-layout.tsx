import Navbar from "@/components/nav";
import { Outlet } from "react-router-dom";

export default function GameLayout() {
  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <div className="h-svh bg-black pb-[126px]">
        <Outlet />
      </div>
      <Navbar />
    </div>
  );
}
