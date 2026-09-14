import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {label && (
        <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
          {label}
        </label>
      )}

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full min-h-[44px] px-4 py-2.5 rounded-lg text-left",
          "surface-glass-strong border border-black/15 dark:border-white/20",
          "text-sm text-ink dark:text-white",
          "flex items-center justify-between gap-2",
          "transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-gold cursor-pointer"
        )}
      >
        <span className="flex items-center gap-2 min-w-0">
          {selectedOption?.icon && (
            <span className="text-gold flex-shrink-0">{selectedOption.icon}</span>
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-black/45 dark:text-white/45 flex-shrink-0 transition-transform duration-[400ms]",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={cn(
            "absolute left-0 right-0 mt-2 z-50",
            "surface-glass-strong rounded-xl border border-black/15 dark:border-white/20",
            "shadow-lift overflow-hidden",
            "animate-slide-down"
          )}
        >
          <div className="py-1 max-h-[280px] overflow-y-auto scrollbar-thin">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => !option.disabled && handleSelect(option.value)}
                disabled={option.disabled}
                className={cn(
                  "w-full px-4 py-2.5 text-left text-sm",
                  "flex items-center gap-2",
                  "transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
                  option.disabled
                    ? "opacity-40 cursor-not-allowed"
                    : value === option.value
                      ? "bg-gold/10 text-ink dark:text-white font-medium"
                      : "text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-ink dark:hover:text-white"
                )}
              >
                {option.icon && (
                  <span className={cn(
                    "flex-shrink-0",
                    value === option.value ? "text-gold" : "text-black/45 dark:text-white/45"
                  )}>
                    {option.icon}
                  </span>
                )}
                <span className="truncate">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
