import { useCallback, useState } from "react";

function readValue<T>(key: string, initialValue: T): T {
  if (typeof window === "undefined") return initialValue;
  try {
    const stored = window.localStorage.getItem(key);
    return stored !== null ? (JSON.parse(stored) as T) : initialValue;
  } catch {
    return initialValue;
  }
}

/**
 * `useLocalStorage` — a small, typed wrapper around `localStorage` that keeps
 * the stored value mirrored in React state. Safe for SSR (no window access).
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => readValue(key, initialValue));

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = next instanceof Function ? next(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          /* storage unavailable — keep in-memory value only */
        }
        return resolved;
      });
    },
    [key]
  );

  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* best-effort */
    }
    setValue(initialValue);
  }, [key, initialValue]);

  return [value, set, remove] as const;
}