const API_BASE: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) || "/api";

/**
 * Resolve a media URL (product image, avatar, …) returned by the backend.
 *
 * Absolute URLs (`https://…`, `data:`, `blob:`) pass through untouched.
 * Relative paths like `/uploads/perfume.webp` are served from the backend,
 * so they are resolved against VITE_API_URL (the dev proxy target) instead of
 * the frontend server where they would 404.
 */
export function resolveApiUrl(url?: string): string {
  if (!url) return "";
  if (/^(https?:)?\/\//i.test(url) || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  if (url.startsWith("/")) {
    const backend = (import.meta.env.VITE_API_URL as string | undefined) || "";
    if (backend) {
      return `${backend.replace(/\/$/, "")}${url}`;
    }
  }
  return url;
}

interface ApiError {
  statusCode: number;
  message: string;
}

export function getErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === "object" && err !== null && "message" in err) {
    const m = (err as { message?: unknown }).message;
    if (typeof m === "string" && m) return m;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw { statusCode: res.status, message: data.message || "Request failed" } as ApiError;
  }

  return data as T;
}

export { request };