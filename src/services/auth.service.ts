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

export async function requestPasswordResetOtp(identifier: string): Promise<{ message: string; expiresInMinutes: number }> {
  return request("/auth/otp/request", {
    method: "POST",
    body: JSON.stringify({ identifier, purpose: "PASSWORD_RESET", channel: "SMS" }),
  });
}

export async function resetPasswordWithOtp(
  identifier: string,
  code: string,
  newPassword: string
): Promise<{ message: string }> {
  return request("/auth/otp/reset-password", {
    method: "POST",
    body: JSON.stringify({ identifier, code, newPassword }),
  });
}