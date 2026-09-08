# ZAANISUNG DESIGN SYSTEM v2.0 — MIST / VAPOR / PERFUME

**Version:** 2.0  
**Date:** September 8, 2026  
**Status:** Active

---

## DESIGN PHILOSOPHY

### Core Concept
The Zaanisung design system v2.0 is inspired by **perfume mist dispersing through air** — soft, atmospheric, fluid, and premium. Every visual element should evoke the sensation of fragrance: gentle, elegant, and ethereal.

### Visual Metaphor
- **Mist:** Soft, translucent, ever-changing
- **Vapor:** Flowing, organic, weightless
- **Diffusion:** Gradual, gentle, atmospheric
- **Fragrance:** Premium, luxurious, memorable

### Design Principles
1. **Soft over Sharp** — Rounded corners, gentle gradients, diffused shadows
2. **Atmosphere over Rigidity** — Glassmorphism, subtle blur, layered depth
3. **Flow over Stasis** — Smooth animations, fluid transitions, organic movement
4. **Elegance over Ostentation** — Restrained luxury, premium simplicity
5. **Breathing over Cramped** — Generous whitespace, comfortable hierarchy

---

## COLOR PALETTE

### Gold — The Signature
Our gold remains the core accent, but now **softer and more diffused**:

```css
--color-gold-100: #f9f3e3  /* Lightest — backgrounds */
--color-gold-200: #f5eccf  /* Very light */
--color-gold-300: #e9d483  /* Light */
--color-gold-400: #dfc15a  /* Medium-light */
--color-gold-500: #d4af37  /* Primary gold */
--color-gold-600: #c29e2e  /* Medium-dark */
--color-gold-700: #a4881f  /* Dark */
--color-gold-800: #876e18  /* Darker */
--color-gold-900: #6b5a14  /* Darkest */
```

**Usage:**
- Primary buttons: gold-500 to gold-600
- Accents: gold-400 to gold-500
- Text highlights: gold-600 to gold-700
- Backgrounds: gold-100 to gold-200
- Borders: gold-300 to gold-400 (with opacity)

### Ink — Deep Blacks
```css
--color-ink: #0a0a0a     /* Primary dark */
--color-ink-900: #101010
--color-ink-800: #171717
--color-ink-700: #1f1f1f
```

### Cream — Warm Backgrounds
```css
--color-cream: #f3efe6       /* Primary light background */
--color-cream-100: #fdfcf9   /* Lightest */
--color-cream-200: #f8f5ee   /* Light */
```

### Mist — Atmospheric Neutrals
```css
--color-mist-50: rgba(128, 128, 128, 0.05)
--color-mist-100: rgba(128, 128, 128, 0.1)
--color-mist-200: rgba(128, 128, 128, 0.2)
--color-mist-300: rgba(128, 128, 128, 0.3)
```

---

## BORDER RADIUS

**All corners are soft and rounded:**

```css
--radius-sm: 8px     /* Small elements (badges, pills) */
--radius-md: 12px    /* Inputs, small buttons */
--radius-lg: 16px    /* Cards, medium elements */
--radius-xl: 24px    /* Large cards, panels (PRIMARY) */
--radius-2xl: 32px   /* Hero sections, major containers */
--radius-full: 9999px /* Circular elements */
```

**Default for most components:** `--radius-xl` (24px)

**When to use:**
- `sm` — Tiny badges, notification dots
- `md` — Form inputs, small buttons
- `lg` — Product cards (mobile), modals
- **`xl`** — Product cards (desktop), dashboard panels, main surfaces
- `2xl` — Landing hero, major sections
- `full` — Avatar images, icon buttons, pills

---

## SHADOWS

**Soft, atmospheric shadows that suggest depth without harshness:**

### Elevation Scale
```css
/* Mist — barely there */
--shadow-mist: 0 2px 12px -2px rgba(0, 0, 0, 0.06), 
               0 1px 3px -1px rgba(0, 0, 0, 0.04);

/* Soft — gentle elevation */
--shadow-soft: 0 4px 24px -4px rgba(0, 0, 0, 0.08), 
               0 2px 6px -2px rgba(0, 0, 0, 0.05);

/* Lift — moderate depth (MOST COMMON) */
--shadow-lift: 0 8px 32px -8px rgba(0, 0, 0, 0.12), 
               0 4px 12px -4px rgba(0, 0, 0, 0.08);

/* Float — strong presence */
--shadow-float: 0 16px 48px -12px rgba(0, 0, 0, 0.18), 
                0 8px 20px -8px rgba(0, 0, 0, 0.12);
```

### Gold Glows
```css
/* Gold glow — diffused, not aggressive */
--shadow-gold-glow: 
  0 0 0 1px rgba(212, 175, 55, 0.15),
  0 8px 32px -8px rgba(212, 175, 55, 0.25),
  0 4px 16px -4px rgba(212, 175, 55, 0.2);

/* Gold shimmer — for hover states */
--shadow-gold-shimmer:
  0 0 0 1px rgba(212, 175, 55, 0.2),
  0 12px 40px -10px rgba(212, 175, 55, 0.35),
  0 6px 20px -6px rgba(212, 175, 55, 0.25);
```

### Glass Inset
```css
/* Inner glow for glassmorphic surfaces */
--shadow-glass-inset: 
  inset 0 1px 0 rgba(255, 255, 255, 0.4),
  inset 0 -1px 0 rgba(0, 0, 0, 0.05);
```

**When to use:**
- **mist** — Subtle hints (hover previews)
- **soft** — Low elevation (dropdown menus)
- **lift** — Cards, panels, floating elements (MOST COMMON)
- **float** — Modals, important overlays
- **gold-glow** — Primary buttons, featured cards
- **gold-shimmer** — Hover states on gold elements
- **glass-inset** — All glassmorphic surfaces

---

## GLASSMORPHISM

**Translucent surfaces with backdrop blur — the signature of v2.0**

### Glass Surfaces

#### Light Glass (Subtle)
```css
.surface-glass {
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(10, 10, 10, 0.06);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-glass-inset), var(--shadow-mist);
  backdrop-filter: blur(18px) saturate(1.2);
}
```
**Use for:** Secondary cards, supporting elements

#### Strong Glass (More Presence)
```css
.surface-glass-strong {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(10, 10, 10, 0.08);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-glass-inset), var(--shadow-soft);
  backdrop-filter: blur(24px) saturate(1.3);
}
```
**Use for:** Primary cards, dashboard panels, admin components

#### Gold-Tinted Glass
```css
.surface-glass-tint {
  background: rgba(212, 175, 55, 0.06);
  border: 1px solid rgba(212, 175, 55, 0.18);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(12px) saturate(1.1);
}
```
**Use for:** Highlights, featured content, low-stock alerts

#### Dark Glass (Ink)
```css
.surface-ink {
  background: rgba(10, 10, 10, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(24px) saturate(1.2);
}
```
**Use for:** Sidebars, headers, navigation (dark theme)

### Glassmorphism Rules
1. **Use sparingly** — Not every element should be glass
2. **Maintain readability** — Text must remain legible
3. **Layer intentionally** — Glass works best over textured backgrounds
4. **Consider performance** — Blur is expensive, use wisely
5. **Test dark mode** — Adjust opacity and borders for dark theme

---

## ATMOSPHERIC EFFECTS

### Mist Overlay
Subtle atmospheric depth for containers:
```html
<div class="surface-glass mist-overlay">
  Content here appears through soft mist
</div>
```

### Vapor Gradient
Flowing, organic background gradients:
```html
<div class="vapor-gradient">
  Soft gold wash
</div>
```

### Orbs (Ambient Glow)
Large, blurred circular glows for background atmosphere:

```html
<!-- Gold orb -->
<div class="orb orb-gold w-96 h-96"></div>

<!-- Strong gold (more prominent) -->
<div class="orb orb-gold-strong w-80 h-80"></div>

<!-- Faint gold (subtle) -->
<div class="orb orb-gold-faint w-64 h-64"></div>

<!-- Mist (neutral) -->
<div class="orb orb-mist w-72 h-72"></div>
```

**When to use orbs:**
- Landing page hero sections
- Dashboard backgrounds
- Sidebar decoration
- Empty state backgrounds
- Modal backdrops

**Rules:**
- Position absolutely
- Use multiple orbs of varying sizes
- Animate subtly (optional)
- Never interfere with readability

---

## TYPOGRAPHY

### Font Families
```css
--font-sans: "Plus Jakarta Sans"      /* Body text */
--font-brand-serif: "Playfair Display" /* Brand, headings */
--font-display: "Cinzel"               /* Luxury display */
```

### Hierarchy
- **Hero titles:** font-display, 3xl-4xl, gold-gradient-text
- **Page titles:** font-brand-serif, 2xl-3xl, ink/white
- **Section titles:** font-brand-serif, xl-2xl, ink/white
- **Card titles:** font-brand-serif, base-lg, ink/white
- **Body text:** font-sans, sm-base, ink-700/white-200
- **Labels:** font-sans, xs, uppercase, tracking-widest
- **Eyebrow (small label):** font-display, 2xs, uppercase, tracking-[0.32em]

### Text Treatments

#### Gold Gradient Text
```html
<h1 class="gold-gradient-text font-display">
  Premium Fragrances
</h1>
```

#### Eyebrow Label
```html
<span class="eyebrow text-gold">
  Eau de Parfum
</span>
```

---

## ANIMATION

### Timing
```css
--duration-instant: 0ms
--duration-fast: 200ms     /* Quick feedback */
--duration-normal: 400ms   /* Most transitions (DEFAULT) */
--duration-slow: 600ms     /* Considered movements */
--duration-very-slow: 800ms /* Dramatic reveals */
```

### Easing
```css
--ease-out: cubic-bezier(0.4, 0, 0.2, 1)        /* Standard */
--ease-in-out: cubic-bezier(0.4, 0, 0.6, 1)    /* Balanced */
--ease-in: cubic-bezier(0.4, 0, 1, 1)          /* Accelerating */
--ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55) /* Bounce */
--ease-mist: cubic-bezier(0.25, 0.46, 0.45, 0.94) /* Vapor-like (PRIMARY) */
```

**Default:** `--ease-mist` with `--duration-normal` (400ms)

### Animation Principles
1. **Fluid, not mechanical** — Use ease-mist for organic feel
2. **Gentle, not aggressive** — Soft scale, fade, translate
3. **Purposeful, not decorative** — Every animation serves UX
4. **Respect reduced motion** — Disable animations when preferred
5. **Performance first** — Use transform and opacity, avoid layout shifts

### Common Transitions
```css
/* Hover lift */
.card {
  transition: transform 400ms var(--ease-mist),
              box-shadow 400ms var(--ease-mist);
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-float);
}

/* Mist fade-in */
.element {
  animation: mist-fade-in 600ms var(--ease-mist);
}

/* Vapor spin (loader) */
.loader {
  animation: vapor-ring-spin 1.2s var(--ease-mist) infinite;
}
```

---

## COMPONENT PATTERNS

### Product Card
```html
<article class="surface-glass-strong rounded-2xl overflow-hidden
                hover:shadow-gold-shimmer hover:-translate-y-1
                transition-all duration-normal ease-mist">
  <!-- Image -->
  <div class="relative aspect-[4/3]">
    <img src="..." class="w-full h-full object-cover 
                          group-hover:scale-105 transition-transform
                          duration-slow ease-mist" />
    <!-- Mist overlay on image -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/40 
                via-transparent to-black/10"></div>
  </div>
  
  <!-- Content -->
  <div class="p-5 space-y-3">
    <span class="eyebrow text-gold">Eau de Parfum</span>
    <h3 class="font-brand-serif text-lg">Product Name</h3>
    <p class="text-sm text-ink-700 dark:text-white/60">Description</p>
    <div class="flex items-center justify-between">
      <span class="text-gold font-bold">₵150.00</span>
      <button class="rounded-full p-2 bg-gold hover:shadow-gold-glow">
        <Plus class="w-4 h-4 text-ink" />
      </button>
    </div>
  </div>
</article>
```

### Dashboard Card
```html
<div class="surface-glass-strong rounded-3xl p-6 
            hover:shadow-lift hover:-translate-y-0.5
            transition-all duration-normal ease-mist">
  <div class="flex items-center justify-between mb-4">
    <span class="eyebrow text-black/50 dark:text-white/50">
      Total Products
    </span>
    <Boxes class="w-5 h-5 text-gold" />
  </div>
  <div class="text-4xl font-mono font-bold">248</div>
  <span class="text-xs text-black/50 dark:text-white/50 mt-2 block">
    View inventory →
  </span>
</div>
```

### Button (Primary)
```html
<button class="gold-gradient-bg rounded-xl px-6 py-3
               text-ink font-semibold uppercase text-xs tracking-wider
               shadow-gold-glow hover:shadow-gold-shimmer
               hover:scale-[1.02] active:scale-[0.98]
               transition-all duration-normal ease-mist">
  Add to Cart
</button>
```

### Input
```html
<input class="w-full rounded-xl px-4 py-3
              surface-glass-strong
              focus:border-gold focus:shadow-gold-glow
              transition-all duration-normal ease-mist" />
```

---

## SPACING SCALE

Use Tailwind's 4px-based scale consistently:

```
0.5 → 2px   (hairline gaps)
1   → 4px   (tight spacing)
2   → 8px   (compact)
3   → 12px  (comfortable)
4   → 16px  (DEFAULT for cards)
5   → 20px  (generous)
6   → 24px  (spacious)
8   → 32px  (section padding)
12  → 48px  (major sections)
16  → 64px  (hero sections)
```

**Component Padding:**
- Small cards: p-4 (16px)
- Standard cards: p-5 (20px)
- Large cards: p-6 (24px)
- Dashboard panels: p-6 to p-8 (24-32px)

**Gaps:**
- Tight lists: gap-1 to gap-2
- Card grids: gap-4 to gap-6
- Section spacing: gap-8 to gap-12

---

## RESPONSIVE BREAKPOINTS

```css
sm: 640px   /* Small tablets portrait */
md: 768px   /* Tablets, small laptops */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

**Mobile-first approach:**
- Design for mobile (375px) first
- Enhance for tablet (768px)
- Optimize for desktop (1280px+)

---

## DARK MODE

**Strategy:** Dual theme with manual toggle + system preference

### Key Adjustments
- **Backgrounds:** cream → ink
- **Text:** ink → white
- **Glass opacity:** Increase slightly in dark mode
- **Shadows:** Reduce intensity
- **Gold:** Remains consistent (slight saturation boost)
- **Borders:** Lighten in dark mode

### Dark Mode Rules
1. Maintain contrast ratios (WCAG AA minimum)
2. Test glassmorphism carefully (needs adjustment)
3. Soften shadows further
4. Increase border opacity slightly
5. Gold remains primary accent (works in both modes)

---

## ACCESSIBILITY

### Focus States
- Visible focus ring: `ring-2 ring-gold ring-offset-2`
- Contrast ratio: minimum 3:1 against background
- Never rely on color alone

### Motion
- Respect `prefers-reduced-motion`
- Provide instant alternatives to animations
- Keep animations subtle by default

### Color Contrast
- Body text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum
- Test with tools (axe, WAVE)

### Touch Targets
- Minimum 44x44px for interactive elements
- 48x48px preferred for primary actions
- Adequate spacing between adjacent targets

---

## IMPLEMENTATION CHECKLIST

### For New Components
- [ ] Use `rounded-xl` or `rounded-2xl` (not sharp corners)
- [ ] Apply glassmorphism where appropriate
- [ ] Use `shadow-lift` for elevation (not harsh shadows)
- [ ] Animate with `duration-normal` and `ease-mist`
- [ ] Test in both light and dark modes
- [ ] Verify touch target sizes (min 44px)
- [ ] Add focus states with gold ring
- [ ] Respect reduced motion preference

### For Existing Components (Migration)
- [ ] Remove sharp corners (add border-radius)
- [ ] Remove `.corner-frame` effect (obsolete)
- [ ] Replace hard shadows with soft atmospheric ones
- [ ] Add glassmorphic background where suitable
- [ ] Update animations to use mist/vapor easings
- [ ] Increase spacing (breathing room)
- [ ] Add hover states with gentle lift
- [ ] Test responsiveness thoroughly

---

## MIGRATION GUIDE (v1 → v2)

### Breaking Changes
1. **Corner frames removed** — `.corner-frame` no longer used
2. **Sharp edges gone** — All components now rounded
3. **Shadow values changed** — `shadow-lift` is softer
4. **Animation timings** — Default is now 400ms (was 300ms)

### Quick Wins
1. Add `rounded-2xl` to all cards
2. Replace `shadow-lift` globally (already updated)
3. Remove `corner-frame` classes
4. Update button styles to use `rounded-xl`
5. Add glassmorphic treatment to key surfaces

### Testing Priority
1. Product cards (high visibility)
2. Dashboard panels (heavy use)
3. Navigation/sidebar (brand touchpoint)
4. Buttons/CTAs (conversion critical)
5. Forms/inputs (UX critical)

---

## EXAMPLES & INSPIRATION

### Perfume-Inspired References
- **Byredo** — Minimalism, soft edges
- **Le Labo** — Atmospheric photography, generous spacing
- **Diptyque** — Elegant typography, subtle luxury
- **Aesop** — Restrained color, premium materials

### Glassmorphism References
- **Apple iOS/macOS** — Frosted glass, subtle blur
- **Windows 11** — Acrylic surfaces, layered depth
- **Stripe Dashboard** — Soft glass cards, atmospheric

### Mist/Vapor Motion
- Slow, organic movement
- Soft fade in/out (not abrupt)
- Gentle scale changes (1.02x max)
- Flowing, not bouncing

---

## VERSION HISTORY

### v2.0 (September 8, 2026)
- **Complete visual transformation** from sharp/geometric to soft/atmospheric
- Introduced mist/vapor design language
- Added comprehensive glassmorphism system
- Soft rounded corners throughout (8-32px)
- New atmospheric shadows (mist, soft, lift, float)
- Gold gradient refinements (more steps, softer)
- Mist-inspired loading animations
- Vapor easing curves
- Orb system for ambient backgrounds

### v1.0 (Previous)
- Sharp rectangular cards
- Corner-frame geometric brackets
- Hard borders and shadows
- Aggressive gold gradients
- Mechanical animations

---

## SUPPORT & FEEDBACK

For questions or suggestions about the design system:
- Review: `/docs/DESIGN-SYSTEM-V2.md`
- Examples: `/src/components/ui/`
- Issues: Document in project tracking

**Design System Owner:** Zaanisung Design Team  
**Last Updated:** September 8, 2026
