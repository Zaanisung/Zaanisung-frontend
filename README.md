# Zaanisung Frontend

Proprietary web application for **Zaanisung Ent. GH** — the public fragrance
storefront and the internal admin inventory/sales portal.

**This repository is confidential and proprietary. It is NOT open source.
Copying, redistribution, or reuse of this code is prohibited without written
permission from Zaanisung Ent. GH.**

---

## About

A single React + Vite + TypeScript app with two experiences:

- **Storefront (public)** — Landing / login / register, shop, product details,
  cart, checkout, order confirmation, order history, and account.
- **Admin portal (restricted)** — dashboard, inventory, record sale, restock,
  add/edit product, sales/orders management, and admin account.

Both experiences share one consistent visual language:

- **Palette:** gold (`#D4AF37`), black, and white — used across light and dark
  themes. Red is reserved strictly for errors and destructive actions.
- **Typography:** Playfair Display (serif), Cinzel (luxury display), and
  Plus Jakarta Sans (body).
- **Theme:** light/dark with a manual toggle that persists in
  `localStorage` (`zaanisung-theme`). When no manual choice is stored, the app
  follows the OS/browser `prefers-color-scheme` setting and reacts live to
  changes.

## Stack

- React 19 + TypeScript (strict)
- Vite 8
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- `motion` for landing animations
- `lucide-react` icons

## Getting Started

Requires Node.js (the version pinned in `.nvmrc` / `package.json` engines).

```bash
npm install
npm run dev        # http://localhost:5173
```

The app talks to the backend API at the URL in `.env`
(`VITE_API_URL`, default `http://localhost:5000`). The backend must be running;
use `../run-all.sh` from the project root to launch the full stack.

## Scripts

| Command             | Purpose                                  |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start Vite dev server                    |
| `npm run build`     | Type-check (`tsc -b`) + production build |
| `npm run typecheck` | TypeScript check only (`tsc --noEmit`)   |
| `npm run lint`      | ESLint                                   |
| `npm run preview`   | Preview the production build             |

## Environment Variables

| Variable            | Required | Description                     |
| ------------------- | -------- | ------------------------------- |
| `VITE_API_URL`      | Yes      | Base URL of the backend API     |

Copy `.env.example` to `.env` and fill in values. `.env` is git-ignored.

## Documentation

- [Architecture](./docs/ARCHITECTURE.md) — layers, folder structure, conventions
- [Routing](./docs/ROUTING.md) — the `AppView` state-machine navigation model
- [Data Layer](./docs/DATA-LAYER.md) — `services/`, `apiClient`, typed endpoints
- [Components](./docs/COMPONENTS.md) — shared components + `ui/` primitives
- [Design System](./docs/DESIGN-SYSTEM.md) — tokens, surfaces, interaction rules

## Project Layout

```
src/
  services/      HTTP client + typed endpoint functions (apiClient, *.service)
  types/         Shared domain types (Product, Order, User, nav) via barrel
  components/
    ui/          Reusable primitives (SearchInput, StatusBadge, EmptyState, ...)
    ...          Button, Input, Logo, ProductCard, ProductGrid, CartItem, ...
  layouts/       CustomerLayout (storefront chrome) and AdminLayout (app chrome)
  pages/         Storefront pages (Landing, Shop, Cart, Checkout, Orders, ...)
  pages/admin/   Admin portal pages (Dashboard, Inventory, Orders, Account, ...)
  router.tsx     Pure view renderer: AppView → page component
  App.tsx        Root: auth state, cart/order logic, theme, view routing
  main.tsx       Entry point
```

## View Routing

Routing is state-based — `src/types/nav.ts` defines the `AppView` union, `App.tsx`
owns the current view, and `src/router.tsx` (`AppRouter`) renders the matching page
inside the appropriate layout. It is **not** a URL router. Key flows:

- `landing` → public hero + sign-up/login card
- `customer/*` → rendered inside `CustomerLayout`
- `admin/*` → gated by `isAdminLoggedIn`, rendered inside `AdminLayout`
- `AdminLogin` sits outside both layouts

See [docs/ROUTING.md](./docs/ROUTING.md) for the full view table and extension steps.

## Brand Assets

Brand logomark, wordmark, and color usage live under `public/`. Keep the gold
`#D4AF37` as the single accent; do not introduce new accent colors.

## License

All rights reserved. See [LICENSE](./LICENSE). © Zaanisung Ent. GH.