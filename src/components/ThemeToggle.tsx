import React from "react";
import { Sun, Moon } from "lucide-react";

export interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    title={isDark ? "Light mode" : "Dark mode"}
    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-ink/60 dark:text-white/70 border border-black/10 dark:border-white/15 hover:text-gold hover:border-gold transition-colors bg-white/60 dark:bg-white/[0.06] backdrop-blur-md flex-shrink-0"
  >
    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
  </button>
);