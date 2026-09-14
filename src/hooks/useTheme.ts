import { useEffect, useState } from "react";

const SYSTEM_DARK_QUERY = "(prefers-color-scheme: dark)";

/** CSS variable that carries the brand accent color (see index.css `@theme`). */
export const ACCENT_COLOR_VAR = "--color-gold";

export const DEFAULT_ACCENT_COLOR = "#d4af37";

const isSystemDark = (): boolean =>
  typeof window !== "undefined" && !!window.matchMedia(SYSTEM_DARK_QUERY).matches;

/**
 * Theme hook.
 *
 * THERE IS NO THEME TOGGLE BUTTON and no manual theme preference: the light /
 * dark theme is always driven by the host system (OS/browser "dark mode")
 * via `prefers-color-scheme`, and it follows the system live as it changes.
 * Only the brand accent color can be customized (Settings → Appearance).
 */
export function useTheme(appearance?: {
  accentColor?: string;
}) {
  const accentColor =
    appearance?.accentColor || DEFAULT_ACCENT_COLOR;

  const [isDark, setIsDark] = useState<boolean>(() => isSystemDark());

  // Follow the host system theme in real time.
  useEffect(() => {
    const mediaQuery = window.matchMedia(SYSTEM_DARK_QUERY);
    const apply = () => setIsDark(isSystemDark());
    apply();
    mediaQuery.addEventListener("change", apply);
    return () => mediaQuery.removeEventListener("change", apply);
  }, []);

  // Reflect the resolved theme on <html> for Tailwind's `dark:` variant.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Apply the chosen accent color as a global CSS variable (brand gold accent).
  useEffect(() => {
    document.documentElement.style.setProperty(
      ACCENT_COLOR_VAR,
      accentColor
    );
  }, [accentColor]);

  return { isDark };
}