import React from "react";

export const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream-50 dark:bg-ink-950">
      {/* Brand spinner — flat gold, no gradients or glow */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Outer rotating ring */}
        <div
          className="absolute inset-0 rounded-full border-[3px] border-gold/15 border-t-gold animate-spin"
          style={{ animationDuration: "1.1s" }}
        />

        {/* Solid gold medallion with flat gold diamond */}
        <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-cream-50 dark:bg-ink flex items-center justify-center">
            <div className="w-6 h-6 bg-gold rounded-sm rotate-45" />
          </div>
        </div>
      </div>
    </div>
  );
};