import React, { useCallback, useEffect, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "../../utils/cn";

export const FullscreenToggle: React.FC<{ className?: string }> = ({ className }) => {
  const [isFs, setIsFs] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggle = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      title={isFs ? "Exit fullscreen" : "Full screen"}
      aria-label={isFs ? "Exit fullscreen" : "Full screen"}
      className={cn(
        "min-h-[44px] min-w-[44px] rounded-full p-2 flex items-center justify-center",
        "text-ink/60 dark:text-white/60 bg-cream dark:bg-white/[0.06] border border-black/10 dark:border-white/15",
        "hover:scale-[1.05] active:scale-[0.98] transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
        className
      )}
    >
      {isFs ? (
        <Minimize2 className="w-4 h-4 text-gold" />
      ) : (
        <Maximize2 className="w-4 h-4 text-gold" />
      )}
    </button>
  );
};
