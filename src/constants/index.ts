/**
 * ZAANISUNG FRONTEND CONSTANTS
 * 
 * Centralized configuration values to avoid magic strings and improve maintainability.
 * These are static application constants, not environment variables.
 */

// ─────────────────────────────────────────────────────────────────────────────
// GHANA-SPECIFIC DATA
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Ghana Digital Address format: XX-0000-0000
 * Example: NT-0000-0000 (Northern Region, Tamale)
 */
export const DIGITAL_ADDRESS_REGEX = /^[A-Z]{2}-\d{4}-\d{4}$/;

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENT METHODS
// ─────────────────────────────────────────────────────────────────────────────

export const PAYMENT_METHOD_LABELS = {
  MOBILE_MONEY: "Mobile Money",
  CARD: "Debit/Credit Card",
  BANK: "Bank Transfer",
  CASH: "Cash on Delivery",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// ORDER STATUSES
// ─────────────────────────────────────────────────────────────────────────────

export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

// ─────────────────────────────────────────────────────────────────────────────
// INVENTORY
// ─────────────────────────────────────────────────────────────────────────────

/** Stock at or below this number is shown as "Low Stock" across the app. */
export const LOW_STOCK_THRESHOLD = 5;

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION RULES
// ─────────────────────────────────────────────────────────────────────────────

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 15,
  DESCRIPTION_MAX_LENGTH: 500,
  ADDRESS_MAX_LENGTH: 200,
} as const;

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
export const PASSWORD_RULE_MESSAGE =
  "Password must be at least 8 characters with an uppercase letter, a lowercase letter, a number and a special character.";
export const GHANA_PHONE_REGEX = /^(\+233|0)[2-5]\d{8}$/;

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL STORAGE KEYS
// ─────────────────────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  CART: "zaanisung-cart",
  LANDING_SESSION: "zaanisung_landing",
  PENDING_PAYMENT: "zaanisung-pending-payment",
} as const;