import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../utils/cn";

export interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  position = "bottom",
  align = "center",
  open: controlledOpen,
  onOpenChange,
  className,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, setIsOpen]);

  // Close on ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, setIsOpen]);

  const positionClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
  };

  const alignClasses = {
    start: position === "top" || position === "bottom" ? "left-0" : "top-0",
    center: position === "top" || position === "bottom" ? "left-1/2 -translate-x-1/2" : "top-1/2 -translate-y-1/2",
    end: position === "top" || position === "bottom" ? "right-0" : "bottom-0",
  };

  return (
    <div className={cn("relative inline-block", className)} ref={popoverRef}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {/* Popover content */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 min-w-[200px]",
            positionClasses[position],
            alignClasses[align],
            "surface-glass-strong rounded-xl border border-black/15 dark:border-white/20",
            "shadow-lift overflow-hidden",
            position === "top" && "animate-slide-up",
            position === "bottom" && "animate-slide-down",
            (position === "left" || position === "right") && "animate-fade-in"
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};
