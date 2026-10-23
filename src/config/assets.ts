/**
 * Centralized Brand Assets and Image Registry for ZAANISUNG
 *
 * NOTE FOR INTEGRATION DEVELOPER:
 * Replace placeholder asset references below with files from:
 * - zaanisung-assets/logo/
 * - zaanisung-assets/backgrounds/
 * - zaanisung-assets/patterns/
 * - zaanisung-assets/sources/
 * - zaanisung-assets/zaanisung-backgrounds/
 */

export const BRAND_CONFIG = {
  name: 'ZAANISUNG',
  tagline: 'Haute Parfumerie & Artisanal Essence',
  location: 'Accra, Ghana',
  currency: 'GHS',
  currencySymbol: 'GH₵',
  supportEmail: 'concierge@zaanisung.com',
  supportPhone: '+233 24 000 0000',
  founded: 'Accra',
};

// High-resolution studio product photography with neutral warm stone/travertine/paper backgrounds
export const PRODUCT_IMAGES = {
  oud_royale: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
  oud_royale_alt: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
  ashanti_amber: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
  ashanti_amber_alt: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
  volta_vetiver: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80',
  volta_vetiver_alt: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
  savannah_neroli: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
  aburi_rose: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80',
  black_star_noir: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80',
  hero_bottle: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=80',
  atelier_story: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=1200&q=80',
};

/**
 * Fallback luxury SVG flacon rendering
 * Guarantees zero broken images even if external network requests are restricted in sandboxes.
 */
export function getProductPlaceholderSvg(name: string, family: string): string {
  const isDark = family.includes('Woody') || name.includes('Noir');
  const bgGradStart = isDark ? '#1C1917' : '#2A241F';
  const bgGradEnd = isDark ? '#0C0A09' : '#171512';
  const liquidColor = family.includes('Amber') ? '#D97706' : family.includes('Fresh') ? '#0D9488' : '#B69A59';

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%23F4EFE6"/>
        <stop offset="100%" stop-color="%23E8DFD1"/>
      </linearGradient>
      <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${bgGradStart}"/>
        <stop offset="50%" stop-color="${bgGradEnd}"/>
        <stop offset="100%" stop-color="${bgGradStart}"/>
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%23DFCA8E"/>
        <stop offset="50%" stop-color="%23B69A59"/>
        <stop offset="100%" stop-color="%238E733B"/>
      </linearGradient>
    </defs>
    <rect width="600" height="750" fill="url(%23bg)"/>
    <ellipse cx="300" cy="620" rx="140" ry="24" fill="%23D5CABE" opacity="0.6"/>
    <!-- Bottle Cap -->
    <rect x="250" y="180" width="100" height="70" rx="3" fill="url(%23gold)"/>
    <!-- Bottle Neck -->
    <rect x="270" y="250" width="60" height="25" fill="%23171512"/>
    <!-- Bottle Body -->
    <rect x="200" y="275" width="200" height="320" rx="12" fill="url(%23glass)"/>
    <rect x="210" y="285" width="180" height="300" rx="8" fill="%23171512" opacity="0.4"/>
    <!-- Liquid glow -->
    <ellipse cx="300" cy="460" rx="70" ry="100" fill="${liquidColor}" opacity="0.35"/>
    <!-- Label -->
    <rect x="235" y="370" width="130" height="110" rx="2" fill="%23FAF8F4" stroke="url(%23gold)" stroke-width="1.5"/>
    <text x="300" y="415" font-family="serif" font-size="12" fill="%23171512" font-weight="bold" text-anchor="middle" letter-spacing="3">ZAANISUNG</text>
    <line x1="260" y1="428" x2="340" y2="428" stroke="%23B69A59" stroke-width="0.8"/>
    <text x="300" y="445" font-family="sans-serif" font-size="9" fill="%23716C64" text-anchor="middle" letter-spacing="1.5">${name.toUpperCase()}</text>
    <text x="300" y="465" font-family="sans-serif" font-size="7" fill="%23B69A59" text-anchor="middle" letter-spacing="1">EXTRAIT DE PARFUM</text>
    <!-- Light Reflection on Glass -->
    <line x1="215" y1="290" x2="215" y2="580" stroke="%23FFFFFF" stroke-width="2" opacity="0.3"/>
    <line x1="225" y1="290" x2="225" y2="580" stroke="%23FFFFFF" stroke-width="1" opacity="0.15"/>
  </svg>`;
}
