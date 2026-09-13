import { useEffect, useState } from "react";

export type ThemePreference = "light" | "dark" | "system";

const SYSTEM_DARK_QUERY = "(prefers-color-scheme: dark)";

/** CSS variable that carries the brand accent color (see index.css `@theme`). */
export const ACCENT_COLOR_VAR = "--color-gold";

export const DEFAULT_ACCENT_COLOR = "#d4af37";

const isSystemDark = (): boolean =>
  typeof window !== "undefined" && !!window.matchMedia(SYSTEM_DARK_QUERY).matches;

function resolveIsDark(preference: ThemePreference | undefined): boolean {
  if (preference === "light") return false;
  if (preference === "dark") return true;
  // "system" (or unset) → follow the operating system / browser preference.
  return isSystemDark();
}

/**
 * Theme hook.
 *
 * The THEME TOGGLE BUTTON IS GONE: there is no manual on-page switch anymore.
 * The active theme is driven entirely by:
 *   1. the user's saved appearance preference (Settings → Appearance), and
 *   2. the OS/browser "dark mode" preference when set to "system".
 * An accent color chosen in Settings is applied as a runtime CSS variable so
 * every `text-gold` / `bg-gold` element updates instantly.
 */
export function useTheme(appearance?: {
  theme?: ThemePreference;
  accentColor?: string;
}) {
  const preference = appearance?.theme ?? "system";
  const accentColor =
    appearance?.accentColor || DEFAULT_ACCENT_COLOR;

  const [isDark, setIsDark] = useState<boolean>(() =>
    resolveIsDark(preference)
  );

  // When the explicit theme (light/dark/system) changes, recompute darkness and
  // follow the system in real time whenever the preference is "system".
  useEffect(() => {
    const apply = () => setIsDark(resolveIsDark(preference));

    apply();
    if (preference !== "system") return;

    const mediaQuery = window.matchMedia(SYSTEM_DARK_QUERY);
    mediaQuery.addEventListener("change", apply);
    return () => mediaQuery.removeEventListener("change", apply);
  }, [preference]);

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