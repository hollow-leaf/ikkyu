import { CSSProperties } from "react";

import { AlertTriangle, Check, Info } from "lucide-react";

import { Toaster as ToasterComponent } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const TOAST_DURATION = 3 * 1000;
export default function Toaster() {
  return (
    <ToasterComponent
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: cn(
            "w-full bg-background text-white border-border shadow-lg gap-1 py-4 flex flex-col items-center justify-start rounded-md before:absolute before:top-0 before:left-0 before:h-1 before:w-full before:bg-sub-text before:content-[''] before:animate-toast-progress",
          ),
          title: cn(
            "text-foreground text-center font-sans font-normal text-sm font-semibold leading-5",
          ),
          description: "text-muted-foreground font-sans font-normal text-sm",
          closeButton: cn(
            "px-4 py-3 text-muted-foreground hover:text-foreground transition-colors !bg-transparent !border-none top-0 right-0 transform-none left-auto",
          ),
          content: "gap-1",
          icon: "absolute top-3 left-4 m-0 w-5 h-5",
        },
        style: {
          "--toast-svg-margin-start": 0,
          "--toast-svg-margin-end": 0,
          pointerEvents: "auto",
        } as CSSProperties,
      }}
      gap={2 * 4}
      icons={{
        success: <Check className="text-success h-5 w-5" />,
        info: <Info className="h-5 w-5 text-foreground" />,
        warning: <AlertTriangle className="text-warning h-5 w-5" />,
        error: <AlertTriangle className="h-5 w-5 text-destructive" />,
      }}
      position="bottom-center"
      duration={TOAST_DURATION}
    />
  );
}
