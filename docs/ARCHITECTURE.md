# Zaanisung Frontend — Architecture

**Private & Confidential** · Zaanisung Enterprise GH

## Overview

Mobile-first React SPA for Zaanisung Ent. GH — a perfume resale e-commerce storefront
plus a dedicated admin portal. The app is intentionally dependency-light (no
`react-router`): navigation is a typed **view-state machine** driven from `App.tsx`.

- **Runtime:** React 19
- **Build:** Vite 8
- **Language:** TypeScript (strict, `erasableSyntaxOnly` — no enums)
- **Styling:** Tailwind CSS v4 + design tokens (`src/index.css`)
- **Animation:** `motion`
- **Icons:** `lucide-react`
- **HTTP:** native `fetch` with a typed client (`src/services/apiClient.ts`)

## Folder Structure

```
src/
├── main.tsx               # Entry point (mounts App)
├── App.tsx                # Single source of truth for state + effects
├── router.tsx             # Pure view renderer (AppView → component)
├── types/
│   ├── nav.ts             # AppView, CustomerTab, AdminTab
│   ├── product.ts         # Product (+ selection types)
│   ├── order.ts           # Order, OrderItem, statuses
│   ├── user.ts            # AuthUser, DashboardData…
│   └── index.ts           # Barrel
├── services/
│   ├── apiClient.ts       # fetch wrapper + error normalization
│   ├── auth.service.ts    # register/login/logout/me
│   ├── product.service.ts # catalog + admin product CRUD
│   ├── order.service.ts   # customer order endpoints
│   ├── inventory.service.ts # restock / record-sale / adjust / history
│   ├── admin.service.ts   # all-orders + status updates + dashboard KPIs
│   └── index.ts           # Barrel
├── components/
│   ├── ui/                # Reusable primitives (SearchInput, StatusBadge…)
│   ├── Button.tsx         # Shared button system
│   ├── Input.tsx          # Shared form input
│   ├── ProductCard.tsx    # Catalog card
│   ├── ProductGrid.tsx    # Grid + filters, search, sort
│   └── …                  # Logo, Carousel, theme toggle, nav pieces
├── layouts/
│   ├── CustomerLayout.tsx # Customer chrome (header/bottom nav/footer)
│   └── AdminLayout.tsx    # Admin chrome (sidebar/header)
├── pages/
│   ├── Landing.tsx        # Marketing landing
│   ├── Login.tsx / Register.tsx
│   ├── Shop.tsx / ProductDetails.tsx
│   ├── Cart.tsx / Checkout.tsx / OrderConfirmation.tsx / Orders.tsx
│   ├── Account.tsx
│   └── admin/             # AdminLogin, Dashboard, Inventory, AddProduct,
│                          # EditProduct, RecordSale, Restock, Orders, Account
├── utils/
│   ├── cn.ts              # className joiner (no Tailwind conflict merging)
│   └── image.ts
├── index.css              # Design tokens + component classes
└── (App.tsx)              # State owner
```

## Layers & Data Flow

```
render →             pages/layouts/components (props in)
state →              App.tsx owns all application state + side effects
navigation →         AppView state machine (read via <App/> handlers)
data →               pages call services → apiClient → backend REST API
```

- **`App.tsx` owns state.** Views, products, orders, cart, auth status, dark mode,
  loading/error flags, and every handler live here and flow down as props. Children
  are presentational and never hold domain state.
- **`router.tsx` renders by view.** It maps the current `AppView` to the matching
  page, composing layouts and passing the slices/handlers each page needs. See
  [ROUTING.md](./ROUTING.md).
- **Pages are pure presenters.** They call service functions for data and surface
  errors through `getErrorMessage` from `apiClient`. See [DATA-LAYER.md](./DATA-LAYER.md).
- **A thick typed boundary.** `types/` shapes everything the backend sends; the
  service functions return exactly those shapes.

## Design System

Brand direction: **gold / black / warm-white, sharp geometric luxury**. Tokens,
glassmorphic surfaces, corner-bracket framing, ambient orbs, and hairlines are
defined once in `src/index.css`. Do not introduce raw hex color classes in any TSX
file — use the tokens. See [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md).

## Key Conventions

1. `cn()` never merges conflicting Tailwind classes — prefer props, not overrides.
2. Every interactive element meets a 44×44 px minimum tap target.
3. Error messages always come from `getErrorMessage(...)`, never raw fetch output.
4. Dark mode uses `.dark` on `<html>` toggled by the single source of truth in App.
5. Admin role is verified server-side; the frontend only hides/permits UX.

## See Also

- [Routing](./ROUTING.md)
- [Data Layer](./DATA-LAYER.md)
- [Components](./COMPONENTS.md)
- [Design System](./DESIGN-SYSTEM.md)
- Root platform spec: [`docs/`](../docs/)