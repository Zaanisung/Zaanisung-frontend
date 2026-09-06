# Zaanisung Frontend — Routing

**Private & Confidential** · Zaanisung Enterprise GH

## Approach

The app does **not** use `react-router`. Navigation is a typed state machine:

- `AppView` (`src/types/nav.ts`) is a discriminated union describing every screen.
- `App.tsx` holds the current `AppView` in state and exposes `navigate(view)`.
- `AppRouter` (`src/router.tsx`) is a pure function of that view: `AppView → JSX`.

This keeps all navigation logic serializable, testable, and free of URL/dependency
coupling. The sentinel definition of every screen lives in one file.

## The View Union

```ts
export type AppView =
  | { type: "landing" }
  | { type: "customer"; page: "login" }
  | { type: "customer"; page: "register" }
  | { type: "customer"; page: "shop" }
  | { type: "customer"; page: "product-details"; productId: string }
  | { type: "customer"; page: "cart" }
  | { type: "customer"; page: "checkout" }
  | { type: "customer"; page: "order-confirmation"; orderId: string }
  | { type: "customer"; page: "orders" }
  | { type: "customer"; page: "account" }
  | { type: "admin"; page: "login" }
  | { type: "admin"; page: "dashboard" }
  | { type: "admin"; page: "inventory" }
  | { type: "admin"; page: "add-product" }
  | { type: "admin"; page: "edit-product"; productId: string }
  | { type: "admin"; page: "record-sale"; initialProductId?: string }
  | { type: "admin"; page: "restock"; initialProductId?: string }
  | { type: "admin"; page: "orders" }
  | { type: "admin"; page: "account" };
```

TypeScript exhaustiveness means adding a screen in `AppView` forces an update to
`AppRouter` — navigation can never silently drop a route.

## How Screens Map

| View                                         | Rendered by                                |
| -------------------------------------------- | ------------------------------------------ |
| `landing`                                    | `pages/Landing` (no layout)                |
| `customer` `login` / `register`              | `pages/Login` / `pages/Register`           |
| `customer` `shop`                            | `pages/Shop` under `CustomerLayout`        |
| `customer` `product-details?productId`       | `pages/ProductDetails`                     |
| `customer` `cart` / `checkout` / `orders` / `account` | `pages/Cart` / `Checkout` / `Orders` / `Account` |
| `customer` `order-confirmation?orderId`      | `pages/OrderConfirmation`                  |
| `admin` `login`                              | `pages/admin/AdminLogin` (no layout)       |
| `admin` others                               | `pages/admin/*` under `AdminLayout`        |
| `admin` `edit-product?productId`             | `pages/admin/EditProduct`                  |

## The Router Contract

`AppRouterProps` (`src/router.tsx`) is the single prop interface App passes down:

- **Data slices** — `products`, `orders`, `cart`, `customerUser`, `recentlyAddedId`,
  `lastConfirmedOrder`, `pendingOrdersCount`, `totalCartCount`, `isDark`,
  `isLoadingProducts`, `productsError`, `customerTab`, `adminTab`, `view`.
- **Callbacks** — one handler per event: navigation, login/register/logout
  (customer + admin), tab changes, cart add/update/remove, checkout/place order,
  and the admin product/order/inventory handlers.

App builds all these with `useCallback`; going through `AppRouterProps` guarantees
children receive a stable, fully-wired interface.

## Behaviors That Must Not Regress

These are intentional asymmetries encoded in App’s handlers:

| Event            | Where it lands                            |
| ---------------- | ----------------------------------------- |
| Customer login   | from Landing → stays on the landing       |
|                  | from Login page → goes to the shop        |
| Register         | account created → shop                    |
| Admin login      | admin dashboard                           |
| Start shopping   | from landing hero → shop                  |
| Customer logout / Admin logout | clears auth and returns to landing / admin login |

## Extending Navigation

1. Add the screen to `AppView` in `src/types/nav.ts`.
2. Handle it in `AppRouter` (use `router.tsx`’s switch/exhaustive check).
3. Wire the parse/transition in `App.tsx` via `navigate(...)`.
4. Rerun `npm run typecheck` — the union enforces step 2.