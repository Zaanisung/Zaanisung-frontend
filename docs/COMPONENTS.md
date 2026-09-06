# Zaanisung Frontend — Components

**Private & Confidential** · Zaanisung Enterprise GH

## Convention

Components are stateless presenters. All state lives in `App.tsx` and flows down as
props; components call service functions only via the injected callbacks/pages.

## UI Primitives (`src/components/ui/`)

Reusable building blocks extracted from page markup. Keep them generic and export a
clear props interface.

### `SearchInput`

```tsx
<SearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Search fragrances..."
  ariaLabel="Search"
  className="w-full max-w-md"   // width/layout only
/>
```
Renders a `surface-glass` field with a leading search icon and a clear button that
shows only while `value` is non-empty. Min 44px tap target.

### `QuantityStepper`

```tsx
<QuantityStepper
  quantity={n}
  max={available}
  min={1}                       // defaults to 0
  variant="gold" | "default"    // gold: framed in gold with 48px controls
  onDecrease={() => …}
  onIncrease={() => …}
/>
```
Disables its minus/plus buttons at `min`/`max` automatically. In the cart
(`default` variant, `min={0}`) decrementing to 0 removes the line item — handle that
in the caller.

### `StatusBadge`

```tsx
<StatusBadge status={order.status} size="sm" | "md" />
```
Renders an uppercase status chip with tone per status:
- `PENDING` / `DELIVERED` → gold fill, black text
- `CONFIRMED` → light surface, bordered
- `SHIPPED` → solid black (inverted in dark mode)
- `CANCELLED` → red

Designed with a `size` prop instead of `className` overrides because `cn()` does not
merge conflicting utility classes.

### `ProductImage`

```tsx
<ProductImage src={url} alt={name} className="w-20 h-26" />
```
Renders a graceful fallback (`Z` monogram) when there is no image URL. Use wherever
a product thumbnail has no bespoke hover treatment (e.g. cart, admin inventory).

### `EmptyState`

```tsx
<EmptyState
  icon={<ShoppingBag className="w-7 h-7" />}
  iconClassName="w-16 h-16"
  title="Your Bag is Empty"
  message="Explore our perfume collection..."
  action={<Button ...>Browse Perfumes</Button>}
/>
```
The branded empty pane: glass surface, gold hairline, corner brackets, faint gold
orb, optional icon/title/message/action.

## Shared Components

- **`Button`** (`components/Button.tsx`) — variants `primary | secondary | gold |
  ghost | danger` and sizes `sm | md | lg`; always ≥ 44px tap target.
- **`Input`** (`components/Input.tsx`) — labeled form field for authentication and
  checkout forms.
- **`ProductCard`** — catalog card with hover/gradient wrapper; deliberately bespoke,
  do **not** swap its thumbnail for `ProductImage`.
- **`ProductGrid`** — grid with `SearchInput`, category filters, sort control, and an
  error/empty state.
- **`CartItem`** — line item using `QuantityStepper` (+`ProductImage`).
- **`Logo`**, **`Carousel`**, **`ThemeToggle`**, **`BottomNav`** — brand/navigation
  pieces. BottomNav is the mobile-only tab bar for customers.
- **`Footer`** — global footer.

## Layouts

- **`CustomerLayout`** — header (logo, theme toggle, minimised cart/orders),
  `BottomNav` on mobile, `Footer`.
- **`AdminLayout`** — admin header/sidebar (Dashboard, Inventory, Orders, Account),
  stateless, wired by `AppRouter`.

## When Use Which

| Need                | Use                             |
| ------------------- | ------------------------------- |
| Filter/search text  | `SearchInput`                   |
| Quantity picker     | `QuantityStepper`               |
| Order status display| `StatusBadge`                   |
| Product thumbnail   | `ProductImage` (unless custom hover) |
| Empty list/screen   | `EmptyState`                    |
| CTA / form actions  | `Button`                        |
| Form fields         | `Input`                         |

## See Also

- [Design System](./DESIGN-SYSTEM.md)
- [Routing](./ROUTING.md)