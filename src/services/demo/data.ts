/**
 * Demo (dummy) data used when VITE_DEMO_MODE=true is set.
 *
 * The whole data set lives in memory so every operation the UI supports
 * (cart, checkout, orders, addresses, inventory, restock, sales, payments)
 * actually mutates this state for the duration of the session — no backend
 * required. Restarting the app resets everything.
 */

import type {
  Address,
  PaymentMethod,
  FullUser,
  AppNotification,
} from "../../types";

/** Solid-colour (gradient-free) perfume art placeholder. */
export function placeholderArt(hex: string, name: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="600">` +
    `<rect width="480" height="600" fill="${hex}"/>` +
    `<rect x="${240 - 46}" y="130" width="92" height="208" rx="16" fill="#ffffff" opacity="0.14"/>` +
    `<rect x="${240 - 38}" y="146" width="76" height="176" rx="12" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="2"/>` +
    `<rect x="${240 - 58}" y="220" width="116" height="22" rx="6" fill="#ffffff" opacity="0.2"/>` +
    `<text x="240" y="470" text-anchor="middle" font-family="Georgia, serif" font-size="26" fill="#ffffff" opacity="0.85">${name}</text>` +
    `</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export interface DemoProduct {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const day = 24 * 60 * 60 * 1000;
const now = Date.now();
const iso = (daysAgo: number) => new Date(now - daysAgo * day).toISOString();

export function seedProducts(): DemoProduct[] {
  const pick = (hex: string, name: string) => placeholderArt(hex, name);
  return [
    {
      _id: "demo-p-1",
      name: "Noir Intense",
      description: "A dark, smoky blend of oud, amber and black pepper.",
      price: 450,
      imageUrl: pick("#3a2a4d", "Noir Intense"),
      stock: 8,
      isActive: true,
      createdAt: iso(90),
      updatedAt: iso(6),
    },
    {
      _id: "demo-p-2",
      name: "Amber Royale",
      description: "Warm amber wrapped in vanilla and soft spices.",
      price: 380,
      imageUrl: pick("#7a3b2e", "Amber Royale"),
      stock: 12,
      isActive: true,
      createdAt: iso(80),
      updatedAt: iso(5),
    },
    {
      _id: "demo-p-3",
      name: "Sahara Nights",
      description: "Golden oud, saffron and a whisper of desert rose.",
      price: 520,
      imageUrl: pick("#1f3a3f", "Sahara Nights"),
      stock: 3,
      isActive: true,
      createdAt: iso(70),
      updatedAt: iso(4),
    },
    {
      _id: "demo-p-4",
      name: "Golden Musk",
      description: "Clean white musk with a luminous amber trail.",
      price: 320,
      imageUrl: pick("#8a5a44", "Golden Musk"),
      stock: 0,
      isActive: true,
      createdAt: iso(60),
      updatedAt: iso(3),
    },
    {
      _id: "demo-p-5",
      name: "Palm & Stone",
      description: "Fresh vetiver, citrus zest and coastal fig.",
      price: 290,
      imageUrl: pick("#2f4d3a", "Palm & Stone"),
      stock: 15,
      isActive: true,
      createdAt: iso(50),
      updatedAt: iso(2),
    },
    {
      _id: "demo-p-6",
      name: "Velvet Bloom",
      description: "Bulgarian rose, peony and creamy sandalwood.",
      price: 410,
      imageUrl: pick("#5a3d6e", "Velvet Bloom"),
      stock: 2,
      isActive: true,
      createdAt: iso(40),
      updatedAt: iso(1),
    },
    {
      _id: "demo-p-7",
      name: "Crimson Gardenia",
      description: "Gardenia, tuberose and a hint of warm honey.",
      price: 350,
      imageUrl: pick("#27404f", "Crimson Gardenia"),
      stock: 7,
      isActive: true,
      createdAt: iso(30),
      updatedAt: iso(1),
    },
    {
      _id: "demo-p-8",
      name: "Ember Oud",
      description: "Smoked oud with labdanum and tonka bean.",
      price: 560,
      imageUrl: pick("#4d2f4a", "Ember Oud"),
      stock: 4,
      isActive: true,
      createdAt: iso(20),
      updatedAt: iso(0),
    },
  ];
}

export function seedFullUser(): FullUser {
  const addresses: Address[] = [
    {
      _id: "demo-addr-1",
      label: "Home",
      recipientName: "Aisha Mohammed",
      phone: "+233 24 555 1234",
      streetAddress: "12 Lamashegu Road",
      city: "Tamale",
      region: "Northern",
      digitalAddress: "NT-0000-1234",
      isDefault: true,
    },
    {
      _id: "demo-addr-2",
      label: "Office",
      recipientName: "Aisha Mohammed",
      phone: "+233 24 555 1234",
      streetAddress: "Suite 4, Zongo Junction",
      city: "Tamale",
      region: "Northern",
      isDefault: false,
    },
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      _id: "demo-pm-1",
      type: "MOBILE_MONEY",
      provider: "MTN MoMo",
      label: "MTN Mobile Money",
      details: { momoNetwork: "MTN", momoNumber: "0245551234" },
      isDefault: true,
    },
    {
      _id: "demo-pm-2",
      type: "CARD",
      provider: "Paystack",
      label: "Visa •••• 4242",
      details: { cardLast4: "4242", cardBrand: "Visa" },
      isDefault: false,
    },
  ];

  return {
    id: "demo-user-1",
    name: "Aisha Mohammed",
    email: "aisha@demo.zaanisung.com",
    phone: "+233 24 555 1234",
    role: "CUSTOMER",
    isEmailVerified: true,
    isPhoneVerified: true,
    passwordMustChange: false,
    addresses,
    paymentMethods,
    appearance: { accentColor: "#d4af37", theme: "system" },
    notificationPrefs: {
      orderUpdates: true,
      promotions: false,
      sms: true,
      email: true,
    },
  };
}

export function seedNotifications(): AppNotification[] {
  return [
    {
      _id: "demo-not-1",
      channel: "IN_APP",
      type: "ORDER_SHIPPED",
      title: "Order shipped",
      body: "Your order ZA-1042 has left our studio and is on its way.",
      status: "SENT",
      createdAt: iso(2),
    },
    {
      _id: "demo-not-2",
      channel: "IN_APP",
      type: "ORDER_DELIVERED",
      title: "Order delivered",
      body: "We hope you love Noir Intense. Rate your purchase in My Orders.",
      status: "SENT",
      readAt: iso(2),
      createdAt: iso(3),
    },
    {
      _id: "demo-not-3",
      channel: "IN_APP",
      type: "PROMOTION",
      title: "New arrival",
      body: "Ember Oud is now in the collection — warm, smoky and unmistakable.",
      status: "SENT",
      createdAt: iso(1),
    },
  ];
}

export function seedOrders(user: FullUser) {
  const customer = { _id: user.id, name: user.name, email: user.email, phone: user.phone };
  return [
    {
      _id: "ORD-1042",
      id: "ORD-1042",
      items: [
        { product: "demo-p-1", name: "Noir Intense", price: 450, quantity: 1 },
        { product: "demo-p-3", name: "Sahara Nights", price: 520, quantity: 1 },
      ],
      total: 970,
      status: "SHIPPED" as const,
      source: "ONLINE" as const,
      customer,
      delivery: { address: "12 Lamashegu Road", city: "Tamale", phone: "+233 24 555 1234", digitalAddress: "NT-0000-1234" },
      payment: { method: "Mobile Money (MTN MoMo)", reference: "MOMO-8821" },
      createdAt: iso(3),
    },
    {
      _id: "ORD-1043",
      id: "ORD-1043",
      items: [
        { product: "demo-p-6", name: "Velvet Bloom", price: 410, quantity: 2 },
      ],
      total: 820,
      status: "PENDING" as const,
      source: "ONLINE" as const,
      customer,
      delivery: { address: "Suìte 4, Zongo Junction", city: "Tamale", phone: "+233 24 555 1234" },
      payment: { method: "Cash on Delivery" },
      createdAt: iso(1),
    },
    {
      _id: "ORD-1044",
      id: "ORD-1044",
      items: [
        { product: "demo-p-2", name: "Amber Royale", price: 380, quantity: 1 },
      ],
      total: 380,
      status: "DELIVERED" as const,
      source: "ONLINE" as const,
      customer,
      delivery: { address: "12 Lamashegu Road", city: "Tamale", phone: "+233 24 555 1234" },
      payment: { method: "Paystack (Card)", reference: "PAY-99112" },
      createdAt: iso(10),
    },
  ];
}