import { request } from "./apiClient";
import type { FullUser, Address, PaymentMethod } from "../types";

export interface FullUserResponse {
  user: FullUser;
}

export async function getMeProfile(): Promise<FullUserResponse> {
  return request("/me");
}

export async function updateProfile(data: {
  name?: string;
  phone?: string;
  email?: string;
}): Promise<FullUserResponse> {
  return request("/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function addAddress(
  data: Omit<Address, "_id" | "isDefault"> & { isDefault?: boolean }
): Promise<FullUserResponse> {
  return request("/me/addresses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAddress(
  addressId: string,
  data: Partial<Omit<Address, "_id">>
): Promise<FullUserResponse> {
  return request(`/me/addresses/${addressId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteAddress(addressId: string): Promise<FullUserResponse> {
  return request(`/me/addresses/${addressId}`, { method: "DELETE" });
}

export async function setDefaultAddress(addressId: string): Promise<FullUserResponse> {
  return request(`/me/addresses/${addressId}/default`, { method: "PATCH" });
}

export async function addPaymentMethod(
  data: Omit<PaymentMethod, "_id" | "isDefault"> & { isDefault?: boolean }
): Promise<FullUserResponse> {
  return request("/me/payment-methods", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function setDefaultPaymentMethod(methodId: string): Promise<FullUserResponse> {
  return request(`/me/payment-methods/${methodId}/default`, { method: "PATCH" });
}

export async function deletePaymentMethod(methodId: string): Promise<FullUserResponse> {
  return request(`/me/payment-methods/${methodId}`, { method: "DELETE" });
}

export async function updateAppearance(data: {
  accentColor?: string;
}): Promise<FullUserResponse> {
  return request("/me/appearance", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function updateNotificationPrefs(data: {
  orderUpdates?: boolean;
  promotions?: boolean;
  sms?: boolean;
  email?: boolean;
}): Promise<FullUserResponse> {
  return request("/me/preferences", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string; user: FullUser }> {
  return request("/auth/change-password", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
