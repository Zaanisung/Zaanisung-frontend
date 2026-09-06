# Zaanisung Frontend — Design System

**Private & Confidential** · Zaanisung Enterprise GH

## Brand Direction

**Gold / black / warm-white — sharp geometric luxury.** No rounded cards, no soft
borders; the signature is crisp 90° corners, thin gold hairlines, and glassmorphic
surfaces. All tokens and component classes live in `src/index.css` and are consumed
as Tailwind utilities.

## Palette

| Token              | Value     | Usage                                   |
| ------------------ | --------- | -------------------------------------- |
| `gold`             | `#d4af37` | Primary accent (CTA borders, badges, highlights) |
| `gold-100/300/600/700/900` | tints | Gradients, hover states, muted fills |
| `ink`              | `#0a0a0a` | Primary text (light mode), surfaces |
| `ink-900 / ink-800`| `#101010` / `#171717` | Dark surfaces |
| `cream`            | `#f3efe6` | Warm whites and hover fills |
| body background    | light `#f6f3ec` · dark `#070707` | Set on `body` |

**Rule:** screens should set text as `text-ink dark:text-white` and never introduce
raw hex color classes. Accent via `text-gold`, `border-gold`, `bg-gold/…`.

## Typography

| Token              | Face                                | Usage                       |
| ------------------ | ----------------------------------- | --------------------------- |
| `font-sans`        | Plus Jakarta Sans                   | Body / UI                   |
| `font-brand-serif` | Playfair Display                    | Headlines, empty-state titles |
| `font-display`     | Cinzel                              | `.eyebrow` labels, numerals |

`.eyebrow` — small uppercase display label (0.625rem, 0.32em letter-spacing).

## Surfaces

- `surface-glass` — translucent white/dark frosted card (blur 18px).
- `surface-glass-strong` — stronger frost (blur 24px); used for major panes.
- `surface-glass-tint` — gold-tinted glass for accent panels.
- `surface-ink` — near-solid dark surface (nav/overlays).
- `gold-gradient-text` — gold gradient clipped to text (hero headlines).

## Signature Details

- `hairline-gold` / `hairline-black` — 1px gradient dividers, commonly pinned to the
  top of glass panes.
- `corner-frame` — animated gold corner brackets; `corner-frame-static` for the
  permanent variant. Signature "geometric luxury" framing.
- `orb` + `orb-gold / gold-strong / gold-faint / ink` — ambient 80px-blur glow orbs
  for layered backgrounds.
- `lux-grid` (+`lux-grid-fade`) — faint 64px blueprint lattice; use behind hero
  sections (typically with a fading mask).
- `shadow-lift` and `shadow-gold-glow` — elevation and gold glow elevations.

## Dark Mode

Toggled by `.dark` on `<html>` (state lives in `App.tsx`, `ThemeToggle` toggles it).
EVERY tonal override ships twice:

```tsx
// light        // dark
text-black      dark:text-white
bg-cream        dark:bg-white/10
border-black/15 dark:border-white/15
```

## Layout & Interaction Rules

1. **44×44px minimum tap targets** on all interactive elements (steppers, search,
   icon buttons, nav items).
2. **Sharp corners** — no `rounded-*` on primary surfaces unless clearly intentional.
3. Monospace numerals (`.font-mono`) for prices and stepper quantities.
4. Focus states use `border-gold` and `outline-none`.
5. `sr-only`/`aria-label` used for icon-only controls.

## Adding a Token

Edit `@theme` in `src/index.css`; use it by name (e.g. `shadow-lift`). Do **not**
add one-off colors or shadows inline in TSX files.

## See Also

- [Components](./COMPONENTS.md)
- [Architecture](./ARCHITECTURE.md)