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
    className="min-h-[40px] min-w-[40px] flex items-center justify-center text-black/60 dark:text-white/60 border border-black/10 dark:border-white/15 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors"
  >
    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
  </button>
);