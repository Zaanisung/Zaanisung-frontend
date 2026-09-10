import React from "react";
import { cn } from "../utils/cn";

export interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = "h-9 w-9",
  showWordmark = false,
  wordmarkClassName = "",
}) => {
  return (
    <div className="flex items-center gap-2">
      <img
        src="/logo.png"
        alt="Zaanisung"
        className={`${className} object-contain select-none`}
        draggable={false}
      />
      {showWordmark && (
        <span
          className={cn(
            "text-lg tracking-[0.16em] font-light text-black dark:text-white font-brand-serif",
            wordmarkClassName
          )}
        >
          ZAANISUNG
        </span>
      )}
    </div>
  );
};
