export type CustomerUser = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
};

export type GhanaRegion =
  | "Ahafo"
  | "Ashanti"
  | "Bono"
  | "Bono East"
  | "Central"
  | "Eastern"
  | "Greater Accra"
  | "North East"
  | "Northern"
  | "Oti"
  | "Savannah"
  | "Upper East"
  | "Upper West"
  | "Volta"
  | "Western"
  | "Western North";

export type Address = {
  _id: string;
  label: string;
  recipientName: string;
  phone: string;
  streetAddress: string;
  city: string;
  region: string;
  digitalAddress?: string;
  postalCode?: string;
  landmark?: string;
  isDefault: boolean;
};

export type PaymentMethodType = "MOBILE_MONEY" | "CARD" | "BANK" | "CASH";

export type PaymentMethod = {
  _id: string;
  type: PaymentMethodType;
  provider: string;
  label: string;
  details: {
    accountNumber?: string;
    accountName?: string;
    bankName?: string;
    momoNetwork?: string;
    momoNumber?: string;
    cardLast4?: string;
    cardBrand?: string;
  };
  isDefault: boolean;
};

export type NotificationPrefs = {
  orderUpdates: boolean;
  promotions: boolean;
  sms: boolean;
  email: boolean;
};

export type FullUser = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  passwordMustChange: boolean;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  appearance?: {
    accentColor?: string;
    theme?: "light" | "dark" | "system";
  };
  notificationPrefs?: NotificationPrefs;
};

export type AppNotification = {
  _id: string;
  channel: "IN_APP" | "SMS" | "EMAIL";
  type:
    | "ORDER_CONFIRMED"
    | "ORDER_SHIPPED"
    | "ORDER_DELIVERED"
    | "ORDER_CANCELLED"
    | "PAYMENT_RECEIVED"
    | "PASSWORD_RESET"
    | "ACCOUNT_VERIFIED"
    | "PROMOTION"
    | "SYSTEM";
  title: string;
  body: string;
  data?: Record<string, unknown>;
  status: "QUEUED" | "SENT" | "FAILED";
  readAt?: string;
  createdAt: string;
};
