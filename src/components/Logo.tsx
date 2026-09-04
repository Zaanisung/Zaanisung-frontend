import React from "react";

export interface LogoProps {
  className?: string;
  showWordmark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-9 w-9", showWordmark = false }) => {
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
          className="text-lg tracking-[0.2em] font-light italic text-white"
          style={{ fontFamily: "Georgia, serif" }}
        >
          ZAANISUNG
        </span>
      )}
    </div>
  );
};
