import React from "react";

export const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream-50 dark:bg-ink-950">
      {/* Kente spinner */}
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="w-24 h-24 rounded-full animate-spin" style={{
          animationDuration: '2s',
          background: `conic-gradient(
            from 0deg,
            rgba(212, 175, 55, 0.9) 0deg,
            rgba(212, 175, 55, 0.9) 40deg,
            rgba(10, 10, 10, 0.85) 40deg,
            rgba(10, 10, 10, 0.85) 60deg,
            rgba(206, 17, 38, 0.8) 60deg,
            rgba(206, 17, 38, 0.8) 120deg,
            rgba(252, 209, 22, 0.9) 120deg,
            rgba(252, 209, 22, 0.9) 200deg,
            rgba(0, 107, 63, 0.75) 200deg,
            rgba(0, 107, 63, 0.75) 280deg,
            rgba(212, 175, 55, 0.9) 280deg,
            rgba(212, 175, 55, 0.9) 360deg
          )`,
          maskImage: 'radial-gradient(circle, transparent 60%, black 60%)',
          WebkitMaskImage: 'radial-gradient(circle, transparent 60%, black 60%)'
        }} />
        
        {/* Inner circle with logo glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold via-gold-600 to-gold-700 shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-cream-50 dark:bg-ink flex items-center justify-center">
              {/* Simplified logo/icon */}
              <div className="w-6 h-6 bg-gradient-to-br from-gold to-gold-700 rounded-sm rotate-45" />
            </div>
          </div>
        </div>
        
        {/* Pulsing glow effect */}
        <div 
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            animationDuration: '2s',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
            filter: 'blur(8px)'
          }}
        />
      </div>
      
      {/* Optional: Kente border at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <div 
          className="h-2 w-full"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              rgba(212, 175, 55, 0.3) 0px,
              rgba(212, 175, 55, 0.3) 8px,
              rgba(10, 10, 10, 0.2) 8px,
              rgba(10, 10, 10, 0.2) 11px,
              rgba(206, 17, 38, 0.3) 11px,
              rgba(206, 17, 38, 0.3) 16px,
              rgba(252, 209, 22, 0.3) 16px,
              rgba(252, 209, 22, 0.3) 23px,
              rgba(0, 107, 63, 0.3) 23px,
              rgba(0, 107, 63, 0.3) 27px
            )`
          }}
        />
      </div>
    </div>
  );
};
