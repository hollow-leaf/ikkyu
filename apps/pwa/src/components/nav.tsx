import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Dice1 } from "lucide-react";

const NAV_ITEMS = {
  pump: { title: "Pump", icon: Dice1, path: "/game/pump" },
  dump: { title: "Dump", icon: Dice1, path: "/game/dump" },
} as const;

export default function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <div className="fixed bottom-0 z-20 flex h-navbar w-full items-center bg-black px-10">
      <div className="mx-auto flex w-full max-w-sm justify-between">
        {Object.entries(NAV_ITEMS).map(
          ([nav, { title, icon: IconComponent, path }]) => (
            <Link
              key={nav}
              to={path}
              className={cn(
                "group flex h-10 max-h-11 w-12 max-w-12 flex-col items-center gap-1 text-sub-text hover:cursor-pointer",
              )}
            >
              <IconComponent
                className={cn(
                  "size-5 stroke-sub-text group-hover:stroke-white",
                  pathname == path && "stroke-white",
                )}
              />
              <div className="whitespace-nowrap text-[11px] group-hover:text-white">
                {title}
              </div>
            </Link>
          ),
        )}
      </div>
    </div>
  );
}
