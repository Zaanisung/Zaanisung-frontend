import type { CustomerUser, FullUser } from "../types";

/**
 * Normalise a user record pulled from the API so the rest of the app can rely
 * on its optional nested collections always being present.
 */
export function normalizeFullUser(user: FullUser): FullUser {
  return {
    ...user,
    phone: user.phone || "",
    addresses: Array.isArray(user.addresses) ? user.addresses : [],
    paymentMethods: Array.isArray(user.paymentMethods) ? user.paymentMethods : [],
    notificationPrefs: user.notificationPrefs || {
      orderUpdates: true,
      promotions: false,
      sms: true,
      email: true,
    },
  };
}

/** Lift a freshly signed-in CustomerUser into a full user shape. */
export function toFullUser(u: CustomerUser): FullUser {
  return normalizeFullUser({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone || "",
    role: u.role,
    isEmailVerified: false,
    isPhoneVerified: false,
    passwordMustChange: false,
    addresses: [],
    paymentMethods: [],
  });
}