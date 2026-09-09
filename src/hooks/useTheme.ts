import { useEffect, useState } from "react";
import { STORAGE_KEYS } from "../constants";

const THEME_KEY = STORAGE_KEYS.THEME;

function getInitialDark(): boolean {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Dark-mode hook.
 *
 * - Manual toggle is persisted to localStorage.
 * - Without a stored preference the app follows the OS/browser preference.
 * - Toggling reflects immediately on the document element (for Tailwind dark:).
 */
export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(getInitialDark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const applySystemTheme = (e: MediaQueryList | MediaQueryListEvent) => {
      if (!window.localStorage.getItem(THEME_KEY)) setIsDark(e.matches);
    };
    applySystemTheme(mediaQuery);
    mediaQuery.addEventListener("change", applySystemTheme);
    return () => mediaQuery.removeEventListener("change", applySystemTheme);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      window.localStorage.setItem(THEME_KEY, next ? "dark" : "light");
      return next;
    });
  };

  return { isDark, toggleTheme };
}