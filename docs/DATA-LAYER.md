# Zaanisung Frontend — Data Layer

**Private & Confidential** · Zaanisung Enterprise GH

## Overview

All HTTP lives in `src/services/`. Pages never call `fetch` directly — they import
small, endpoint-shaped functions whose return types come from `src/types/`.

```
pages/components → service function → apiClient (fetch) → backend REST
                                       ↓
                              getErrorMessage(normalized)
```

## `apiClient.ts`

- Wraps `fetch` with `credentials: "include"` (the JWT rides in an HTTP-only cookie).
- Parses JSON responses and normalizes failures into a consistent `{ message }` shape.
- Throws errors that services let bubble up to the UI.

**`getErrorMessage(error: unknown): string`** — the only sanctioned way to turn any
thrown error into a user-facing message. Its behavior is already covered by frontend
lint/typecheck; UI code must not do ad-hoc `error.message` reads.

## Service Modules

| Module                 | Exports                                                | Backend routes                 |
| ---------------------- | ------------------------------------------------------ | ------------------------------ |
| `auth.service.ts`      | `registerUser`, `loginUser`, `logoutUser`, `getMe`     | `/auth/register ‖ login ‖ logout ‖ me` |
| `product.service.ts`   | `getProducts`, `getProduct`, `createProduct`, `updateProduct`, `deleteProduct` | `/products*`        |
| `order.service.ts`     | `placeOrder`, `getMyOrders`, `getMyOrder`              | `/orders*` (customer, authed)  |
| `inventory.service.ts` | `restockProduct`, `recordPhysicalSale`, `adjustStock`, `getStockHistory` | `/admin/inventory*` |
| `admin.service.ts`     | `getAllOrders`, `updateOrderStatus`, `getDashboard`    | `/admin/orders*`, `/admin/dashboard` |
| `profile.service.ts`   | `getMeProfile`, `updateProfile`, `addAddress`, `updateAddress`, `deleteAddress`, `setDefaultAddress`, `addPaymentMethod`, `setDefaultPaymentMethod`, `deletePaymentMethod`, `updateAppearance`, `updateNotificationPrefs`, `changePassword`, `initializePayment`, `verifyPayment` | `/me*`, `/auth/change-password`, `/payments/*` |
| `notification.service.ts` | `getNotifications`, `markNotificationRead`, `markAllNotificationsRead` | `/notifications*` |

All functions return the backend's raw payload (`{ products }`, `{ order }`,
`{ orders }`, `{ movements }`, `{ user }`, `{ notifications }`, …) typed against
`src/types/`.

`profile.service.ts` powers the customer dashboard — profile/address/payment-method
editing, appearance and notification prefs, password change, and the Paystack
initialize/verify flow.

## Types Boundary (`src/types/`)

| Module        | Contents                                                      |
| ------------- | ------------------------------------------------------------- |
| `nav.ts`      | `AppView`, `CustomerTab`, `AdminTab`, `DashboardPage`         |
| `product.ts`  | `Product`, related selection/detail types                     |
| `order.ts`    | `Order`, `OrderItem`, `OrderStatus` literal union; `delivery.digitalAddress` optional |
| `user.ts`     | `FullUser`, `CustomerUser`, `Address`, `PaymentMethod`, `NotificationPrefs`, `AppNotification`, `GhanaRegion` |
| `index.ts`    | Barrel — pages should import from `"../types"` (the barrel)   |

`OrderStatus` mirrors the backend enum so `StatusBadge` and admin controls share one
source of truth on the client. `FullUser` mirrors the backend user payload including
`addresses` (with the Ghana Post `digitalAddress`), `paymentMethods`,
`notificationPrefs`, `isEmailVerified`/`isPhoneVerified`, and `passwordMustChange`.

## Conventions

1. New endpoints get a function in the matching service module, typed to the
   `types/` payload — never an inline `fetch` in a page.
2. Errors are surfaced exclusively through `getErrorMessage`.
3. `services/index.ts` is the public barrel; import services from `"../services"`.
4. The admin tier is guarded server-side; client failure handling must assume the
   server is the source of truth for authorization.

## See Also

- [Architecture](./ARCHITECTURE.md)
- [API Reference](../zaanisung-backend/docs/API.md)