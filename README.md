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

## Project Layout

```
src/
  api/           HTTP client for the backend API
  components/    Shared UI: Button, Input, Logo, ProductCard, ProductGrid,
                 CartItem, Footer, BottomNav, ThemeToggle
  layouts/       CustomerLayout (storefront chrome) and AdminLayout (app chrome)
  pages/         Storefront pages (Landing, Shop, Cart, Checkout, Orders, ...)
  pages/admin/   Admin portal pages (Dashboard, Inventory, Orders, Account, ...)
  types.ts       Shared domain types (Product, Order, User, tabs/views)
  App.tsx        Root: auth state, cart/order logic, theme, view routing
  main.tsx       Entry point
```

## View Routing

Routing is state-based in `App.tsx` (`view` + `customerTab` + `adminTab`), not
a URL router. Key flows:

- `landing` → public hero + sign-up/login card
- `customer/*` → rendered inside `CustomerLayout`
- `admin/*` → gated by `isAdminLoggedIn`, rendered inside `AdminLayout`
- `AdminLogin` sits outside both layouts

## Brand Assets

Brand logomark, wordmark, and color usage live under `public/`. Keep the gold
`#D4AF37` as the single accent; do not introduce new accent colors.

## License

All rights reserved. See [LICENSE](./LICENSE). © Zaanisung Ent. GH.