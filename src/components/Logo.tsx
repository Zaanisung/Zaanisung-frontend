import React from "react";
import { cn } from "../utils/cn";

export interface LogoProps {
  className?: string;
  showWordmark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className,
  showWordmark = false,
}) => {
  const sizeClass = showWordmark ? (className ?? "h-9") : (className ?? "h-9 w-9");

  return (
    <div className="flex items-center gap-2">
      <img
        src={showWordmark ? "/assets/logo-full.png" : "/assets/logo-mark.png"}
        alt="Zaanisung"
        className={cn("object-contain select-none", sizeClass)}
        draggable={false}
      />
    </div>
  );
};