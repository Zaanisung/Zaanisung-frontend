import React from "react";

export const SimpleLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream-50 dark:bg-ink-950">
      {/* Flat gold ring spinner */}
      <div className="relative w-20 h-20">
        <div
          className="absolute inset-0 rounded-full border-[6px] border-gold/15 border-t-gold animate-spin"
          style={{ animationDuration: "1.1s" }}
        />
      </div>
    </div>
  );
};