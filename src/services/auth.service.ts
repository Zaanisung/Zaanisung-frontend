import { request } from "./apiClient";

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: "CUSTOMER" | "ADMIN";
}

export async function registerUser(data: {
  name: string;
  email?: string;
  phone?: string;
  password: string;
}): Promise<{ user: AuthUser }> {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(
  identifier: string,
  password: string
): Promise<{ user: AuthUser }> {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
}

export async function logoutUser(): Promise<{ message: string }> {
  return request("/auth/logout", { method: "POST" });
}

export async function getMe(): Promise<{ user: AuthUser }> {
  return request("/auth/me");
}