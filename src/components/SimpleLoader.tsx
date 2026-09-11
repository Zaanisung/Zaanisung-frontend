import React from "react";

export const SimpleLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream-50 dark:bg-ink-950">
      {/* Simple Kente-colored spinner */}
      <div className="relative w-20 h-20">
        {/* Spinning Kente ring */}
        <div 
          className="absolute inset-0 rounded-full border-[6px] border-transparent animate-spin"
          style={{
            animationDuration: '1.5s',
            borderTopColor: 'rgba(212, 175, 55, 0.95)',
            borderRightColor: 'rgba(206, 17, 38, 0.85)',
            borderBottomColor: 'rgba(0, 107, 63, 0.8)',
            borderLeftColor: 'rgba(252, 209, 22, 0.95)'
          }}
        />
        
        {/* Inner glow */}
        <div 
          className="absolute inset-2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)'
          }}
        />
      </div>
    </div>
  );
};
