import type { AuthUser } from "./auth.service";
import { request } from "./apiClient";

/**
 * One-tap demo account creation.
 *
 * Calls `POST /auth/demo` which either creates a fresh showcase customer
 * account or logs you back into the existing one (idempotent). In demo mode
 * this is rendered as the primary CTA on the landing and login screens.
 *
 * @param role  Pass `"ADMIN"` to create/sign into the seeded seller account.
 *              Defaults to `"CUSTOMER"`.
 */
export async function createDemoAccount(role?: "CUSTOMER" | "ADMIN"): Promise<AuthUser> {
  return request<AuthUser>("/auth/demo", {
    method: "POST",
    body: JSON.stringify({ role: role ?? "CUSTOMER" }),
  });
}
