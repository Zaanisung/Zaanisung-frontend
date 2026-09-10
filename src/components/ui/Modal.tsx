import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}) => {
  // Handle ESC key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-[95vw]",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in"
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      {/* Backdrop - glassmorphic mist overlay */}
      <div 
        className="absolute inset-0 bg-ink/60 dark:bg-black/80 backdrop-blur-xl"
        aria-hidden="true"
      />

      {/* Floating mist orbs in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="orb orb-gold-faint animate-mist-float absolute top-1/4 left-1/4 w-64 h-64 opacity-30" />
        <div className="orb orb-gold-faint animate-mist-drift absolute bottom-1/3 right-1/4 w-48 h-48 opacity-20" />
      </div>

      {/* Modal content */}
      <div
        className={cn(
          "relative w-full animate-zoom-in",
          sizeClasses[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="surface-glass-strong rounded-2xl shadow-lift-lg border border-white/20 dark:border-white/10 overflow-hidden">
          {/* Gold hairline crown */}
          <div className="absolute top-0 inset-x-0 hairline-gold" aria-hidden="true" />

          {/* Header */}
          {(title || showCloseButton) && (
            <div className="relative px-6 py-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between gap-4">
              {title && (
                <h2 className="text-xl font-brand-serif font-medium text-ink dark:text-white leading-tight">
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[44px] min-w-[44px] rounded-lg flex items-center justify-center text-black/45 dark:text-white/45 hover:text-ink dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.05] active:scale-[0.95]"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="relative px-6 py-5 max-h-[calc(100vh-12rem)] overflow-y-auto scrollbar-thin">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
