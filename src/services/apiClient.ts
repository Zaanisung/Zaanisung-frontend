const API_BASE: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) || "/api";

/** Set VITE_DEMO_MODE=true to run the frontend against in-memory dummy data. */
export const IS_DEMO_MODE: boolean =
  (import.meta.env.VITE_DEMO_MODE as string | undefined) === "true";

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
  if (IS_DEMO_MODE) {
    const { demoRequest } = await import("./demo/api");
    return demoRequest<T>(path, options, API_BASE);
  }

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