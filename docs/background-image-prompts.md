# Zaanisung — Background Image Prompts

Ultra-specific generation prompts for the light, editorial perfume
photography that sits behind the Landing page sections (hero, collections,
about, craft, CTA).

## How the site consumes these images

- Source photos (PNG) live in **`/home/wsuits6/WORK/ZAANISUNG/zaanisung-backgrounds/`** and are
  committed to the frontend as **WebP (quality 82, `magick <name>.png -quality 82 .../backgrounds/<name>.webp`)**
  under **`public/assets/backgrounds/`** with the exact filenames below. Putting a source PNG in the
  backgrounds folder, regenerating the WebP, and committing it is all that's needed to swap an image.
- The landing page looks up `url('/assets/backgrounds/<filename>')`. Image generation
  is optional: until a file exists, the section shows a soft cream/gold gradient wash, so
  everything still looks finished.
- Recommended format: **WebP, quality ~82, landscape**, `background-size: cover`.
- Generate **2–4 candidate variants per slot**, pick the one with the best bottle
  realism + lightest background, then drop it in.

| Slot | Filename | Active in |
| --- | --- | --- |
| Hero banner (full-bleed, text left + auth card right) | `hero.webp` | Landing hero |
| Signature Collection band | `collections.webp` | Landing collections |
| About / Our Story split | `about.webp` | Landing about |
| Craft / Why Zaanisung band | `craft.webp` | Landing craft |
| CTA banner behind center glass card | `cta.webp` | Landing CTA |
| Login/Register dark-left panel | `auth-panel.webp` | Login + Register |

## Global style tokens (paste this dictionary block into every prompt)

```
Style: bright luxury editorial perfume photography, airy and clean, VERY LIGHT
background, soft cream ivory off-white (#F6F3EC) studio, warm golden morning
window light from the left, gentle daylight, sunlit glow, subtle gold accents.
Art direction: high-end department-store campaign, Vogue perfume editorial,
rich detail, crisp realistic product photography, shallow depth of field,
soft natural bokeh, calm negative space, no clutter, minimal props.
Palette: cream, ivory, champagne gold (#D4AF37), warm beige, soft shadows,
tiny hints of kente cloth black-red-gold woven trim only as a small accent.
Lighting: diffused, luminous, low-contrast gradients, nothing overexposed,
bottles glowing with golden highlights, tasteful reflections.
```

Universal negative prompt (append to every generation):

```
dark, moody, black background, harsh shadows, heavy vignette, neon,
cluttered, text, watermark, signature, logo, mockup UI, screenshot,
grid, pattern, tiled texture, wallpaper, seam, border, frame, blurry
background text, misspelled labels, warped lettering, plastic toys,
CGI-looking render, oversaturated, purple/violet cast
```

## 1. Hero — `hero.webp` (wide banner)

Subject concept: an elegant still-life **collection of several different
luxury perfume brands** displayed together — a curated counter of bottles at
different heights with a soft vignette.

Master prompt:

```
Style dictionary above. Wide 21:9 luxury perfume campaign banner.
Composition: a shallow, softly-lit display table across the lower third
of the frame with seven to nine REAL perfume bottles of DIFFERENT well-known
luxury brands — round, column, rectangular and fluted shapes, glass and
crystal, gold and silver caps — arranged loosely left of center and along the
bottom-right, never covering the upper-left sky. Larger blurred hero bottle
standing tall at the right edge of the frame. Each bottle glowing with a warm
golden rim-light. See-through glass shelves faintly visible behind.
Background: a vast soft cream-ivory vertical gradient from pale sunlight
top-left down to warm beige at the bottom, faint wisp of gold mist, two or
three floating glass fragrance vials catching light. Calm, generous airy
negative space across the top 40% and the left two-thirds for text overlay.
Depth: f/2.8 shallow focus, creamy bokeh, photorealistic, 8k detail.
```

Composition note: text lives on the left (headline + CTAs) and a glass auth
card overlaps the right third — keep the right third's lower area interesting
(the tall hero bottle + a few companions) and the left/middle open.

Variant A (brands readable — best-effort): preface with `IGNORE "PROMPT TEXT";
"Depict famous designer fragrance labels (e.g. Dior, Chanel, Guerlain,
Tom Ford, YSL, Armani, Versace) with accurate real label text and logos"`.
Variant B (safer, always crisp): replace that line with `Refined unbranded
luxury flacons whose labels are smooth and unreadable`, for guaranteed no
garbled typography.

## 2. Signature Collection — `collections.webp` (wide band)

Subject concept: a **horizontal rhythm of perfume bottles of mixed brands** on
a floating glass shelf line, softly faded into the sky.

```
Style dictionary above. Wide 16:9 banner for a products section.
Composition: a single floating smoked-crystal shelf at the 1/3 height line
running across the frame, holding a disciplined row of TEN perfume bottles of
different luxury brands and shapes, small and large alternating, neatly
spaced, slight height variation; the middle of the row slightly out of focus
so a carousel of product cards can sit over it. Above the shelf: near-empty
creamy sky with gentle light bloom. Below: soft warm beige with a faint
water-like reflection of the bottles, blurred.
Lighting: bright even daylight behind, golden rim-light on every bottle.
Depth: f/3.2, smooth bokeh, photorealistic, 8k.
```

## 3. About / Our Story — `about.webp` (split section)

Subject concept: warm, personal **artisanal table scene** — amber perfume oils,
a vintage decanter, freshly cut green botanicals, and a few open boxes of
mixed-brand bottles.

```
Style dictionary above. Wide 16:9 editorial photograph for a story section
whose right half is covered by glass testimonial cards.
Composition: intimate still-life occupying the LEFT-to-CENTER and BOTTOM-RIGHT
of the frame: an old teak apothecary table with clear and amber glass
vials, a gold-capped spray bottle, a linen cloth (tiny kente-edge trim on one
fold), loose green leaves and dried petals scattered softly, steam-free warm
air, one bottle uncapped with a subtle scent-curl of warm light. The RIGHT
third and UPPER half stay light and nearly empty for overlaying cards.
Lighting: golden-hour window light raking softly from upper-left, luminous
shadows. Depth: f/2.5, creamy bokeh, photorealistic, 8k.
```

## 4. Craft / Why Zaanisung — `craft.webp` (band behind 4 feature cards)

Subject concept: **layered craft ingredients + bottles** forming a clean,
rhythmical mosaic feel that stays quiet behind cards.

```
Style dictionary above. Wide 16:9 banner, middle 60% must stay visually calm.
Composition: on a wide light-walnut workbench, an orderly still-life in a
diagonal rhythm: amber and crystal perfume bottles of different brands and
sizes, unopened, alternating with neat trays of coffee beans, amber resin
globules, dried jasmine petals, sandalwood chips, fresh lemon zest, and a
small mortar-pestle; gold-droplet glass pipette resting on a mat. Everything
fades to a soft cream gradient toward the top third and the corners.
Lighting: clean bright daylight, soft shadows, golden accents, gentle
symmetry but no rigid grid. Depth: f/3.5, photorealistic, 8k.
```

## 5. CTA — `cta.webp` (behind centered glass card)

Subject concept: **spotlit hero bottle scene** with wide open center.

```
Style dictionary above. Wide 16:9. The exact CENTER must stay empty and very
light (a glass card overlays it).
Composition: a majestic single luxury perfume bottle in an elegant round base
standing on a mirrored pedestal slightly to the RIGHT of center, with three
short companions to its left, together forming a low vignette of the group;
behind them a soft diagonal band of blurred perfume-bottle silhouettes fading
into cream fog. A warm golden spotlight halo glows at the top-center. Wide,
clean, symmetrical negative space in the middle top.
Lighting: single warm key light, luminous fog diffusion. Depth: f/2.8,
photorealistic, 8k.
```

## Optional 6. Auth panel — `auth-panel.webp` (dark left card on Login/Register)

If desired, one warm vertical scene for the dark left panel:

```
Vertical 3:4 editorial crop of the hero-style still-life: focused tight on
two crystal perfume flacons (one gold-capped, one black) with warm golden
backlight and slow bokeh, vignette dark at edges (the panel art is dark
ink). Keep it mostly interior glow — moody-luxury yet soft, not harsh.
```

## Acceptance checklist (before dropping a file in)

- [ ] Background is clearly LIGHT (cream/ivory dominates, no black backdrop)
- [ ] Multiple perfume brands/shapes are visible and look REALISTIC (labels crisp or smoothly unreadable)
- [ ] Gold + cream palette matches — no green/blue/violet cast
- [ ] Required negative space is preserved for the section's text/cards
- [ ] No text, watermark, grid, pattern, or tiling artifacts
- [ ] Saved with the exact filename + inside `public/assets/backgrounds/`