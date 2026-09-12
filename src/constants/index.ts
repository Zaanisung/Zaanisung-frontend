/**
 * ZAANISUNG FRONTEND CONSTANTS
 * 
 * Centralized configuration values to avoid magic strings and improve maintainability.
 * These are static application constants, not environment variables.
 */

// ─────────────────────────────────────────────────────────────────────────────
// GHANA-SPECIFIC DATA
// ─────────────────────────────────────────────────────────────────────────────

export const GHANA_REGIONS = [
  "Ahafo",
  "Ashanti",
  "Bono",
  "Bono East",
  "Central",
  "Eastern",
  "Greater Accra",
  "North East",
  "Northern",
  "Oti",
  "Savannah",
  "Upper East",
  "Upper West",
  "Volta",
  "Western",
  "Western North",
] as const;

export type GhanaRegion = (typeof GHANA_REGIONS)[number];

/**
 * Ghana Digital Address format: XX-0000-0000
 * Example: NT-0000-0000 (Northern Region, Tamale)
 */
export const DIGITAL_ADDRESS_REGEX = /^[A-Z]{2}-\d{4}-\d{4}$/;

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENT METHODS
// ─────────────────────────────────────────────────────────────────────────────

export const MOMO_NETWORKS = ["MTN", "Vodafone", "Telecel", "AT"] as const;
export type MoMoNetwork = (typeof MOMO_NETWORKS)[number];

export const PAYMENT_METHOD_TYPES = [
  "MOBILE_MONEY",
  "CARD",
  "BANK",
  "CASH",
] as const;
export type PaymentMethodType = (typeof PAYMENT_METHOD_TYPES)[number];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethodType, string> = {
  MOBILE_MONEY: "Mobile Money",
  CARD: "Debit/Credit Card",
  BANK: "Bank Transfer",
  CASH: "Cash on Delivery",
};

// ─────────────────────────────────────────────────────────────────────────────
// ORDER STATUSES
// ─────────────────────────────────────────────────────────────────────────────

export const ORDER_STATUSES = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "text-gold bg-gold/10 border-gold/30",
  PROCESSING: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
  SHIPPED: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800",
  DELIVERED: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
  CANCELLED: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
};

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATION TYPES
// ─────────────────────────────────────────────────────────────────────────────

export const NOTIFICATION_TYPES = [
  "ORDER_PLACED",
  "ORDER_PROCESSING",
  "ORDER_SHIPPED",
  "ORDER_DELIVERED",
  "PAYMENT_SUCCESS",
  "PAYMENT_FAILED",
  "PASSWORD_CHANGED",
  "ACCOUNT_VERIFIED",
  "PROMO",
  "SYSTEM",
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  ORDER_PLACED: "Order Placed",
  ORDER_PROCESSING: "Order Processing",
  ORDER_SHIPPED: "Order Shipped",
  ORDER_DELIVERED: "Order Delivered",
  PAYMENT_SUCCESS: "Payment Successful",
  PAYMENT_FAILED: "Payment Failed",
  PASSWORD_CHANGED: "Password Changed",
  ACCOUNT_VERIFIED: "Account Verified",
  PROMO: "Promotion",
  SYSTEM: "System Notification",
};

// ─────────────────────────────────────────────────────────────────────────────
// USER ROLES
// ─────────────────────────────────────────────────────────────────────────────

export const USER_ROLES = ["CUSTOMER", "ADMIN"] as const;
export type UserRole = (typeof USER_ROLES)[number];

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT CATEGORIES (Future Feature)
// ─────────────────────────────────────────────────────────────────────────────

export const PRODUCT_CATEGORIES = [
  "EAU_DE_PARFUM",
  "EAU_DE_TOILETTE",
  "COLOGNE",
  "BODY_SPRAY",
  "GIFT_SET",
] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  EAU_DE_PARFUM: "Eau de Parfum",
  EAU_DE_TOILETTE: "Eau de Toilette",
  COLOGNE: "Cologne",
  BODY_SPRAY: "Body Spray",
  GIFT_SET: "Gift Set",
};

// ─────────────────────────────────────────────────────────────────────────────
// INVENTORY
// ─────────────────────────────────────────────────────────────────────────────

export const LOW_STOCK_THRESHOLD = 3;
export const OUT_OF_STOCK_THRESHOLD = 0;

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION TIMINGS (milliseconds)
// ─────────────────────────────────────────────────────────────────────────────

export const ANIMATION_DURATION = {
  INSTANT: 0,
  FAST: 200,
  NORMAL: 400,
  SLOW: 600,
  VERY_SLOW: 800,
} as const;

export const ANIMATION_EASING = {
  EASE_OUT: "cubic-bezier(0.4, 0, 0.2, 1)",
  EASE_IN_OUT: "cubic-bezier(0.4, 0, 0.6, 1)",
  EASE_IN: "cubic-bezier(0.4, 0, 1, 1)",
  SPRING: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  MIST: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", // Soft, vapor-like easing
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// FEEDBACK TIMINGS
// ─────────────────────────────────────────────────────────────────────────────

export const FEEDBACK_DURATION = {
  TOAST: 3000, // 3 seconds
  SUCCESS_INDICATOR: 3000, // 3 seconds (increased from 1.5s)
  ERROR_MESSAGE: 5000, // 5 seconds
  INFO_MESSAGE: 4000, // 4 seconds
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Border radius scale for consistent rounded corners
 * Moving from sharp geometric to soft, mist-inspired aesthetics
 */
export const BORDER_RADIUS = {
  NONE: "0px",
  SM: "8px",
  MD: "12px",
  LG: "16px",
  XL: "24px",
  XXL: "32px",
  FULL: "9999px",
} as const;

/**
 * Icon sizes for consistent sizing across components
 */
export const ICON_SIZE = {
  XS: 14, // 14px
  SM: 16, // 16px
  MD: 20, // 20px
  LG: 24, // 24px
  XL: 32, // 32px
} as const;

/**
 * Glassmorphism blur values
 */
export const BLUR_AMOUNT = {
  LIGHT: "12px",
  MEDIUM: "18px",
  STRONG: "24px",
  HEAVY: "32px",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// BREAKPOINTS (for JavaScript usage)
// ─────────────────────────────────────────────────────────────────────────────

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const;

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
export const GHANA_PHONE_REGEX = /^(\+233|0)[2-5]\d{8}$/;

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL STORAGE KEYS
// ─────────────────────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  THEME: "zaanisung-theme",
  CART: "zaanisung-cart",
  LANDING_SESSION: "zaanisung_landing",
  SIDEBAR_COLLAPSED: "zaanisung-dash-sidebar-collapsed",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SEO DEFAULTS
// ─────────────────────────────────────────────────────────────────────────────

export const SEO_DEFAULTS = {
  SITE_NAME: "Zaanisung",
  SITE_TAGLINE: "Premium Fragrances from Ghana",
  SITE_DESCRIPTION: "Discover luxury perfumes and authentic fragrances at Zaanisung Enterprise GH. Premium eau de parfum, colognes, and fragrance collections delivered from Tamale across Ghana.",
  OG_IMAGE: "/og-image.jpg",
  TWITTER_HANDLE: "@zaanisung",
  LOCALE: "en_GH",
  SITE_URL: "https://zaanisung.com", // TODO: Update with actual domain
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// API CONFIGURATION (Non-secret client-side values)
// ─────────────────────────────────────────────────────────────────────────────

export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────────────────────────────────────

export const PAGINATION = {
  PRODUCTS_PER_PAGE: 24,
  ORDERS_PER_PAGE: 20,
  NOTIFICATIONS_PER_PAGE: 50,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// CART LIMITS
// ─────────────────────────────────────────────────────────────────────────────

export const CART_LIMITS = {
  MAX_QUANTITY_PER_ITEM: 99,
  MAX_ITEMS: 50,
} as const;
