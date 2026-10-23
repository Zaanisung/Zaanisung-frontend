/**
 * Currency utilities for Ghana Cedi (GHS)
 */

export function formatGHS(amount: number, includeDecimals = true): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'GH₵ 0.00';
  }
  const formattedNumber = new Intl.NumberFormat('en-GH', {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(amount);

  // Ensure clean consistent luxury formatting: GH₵ 1,250.00
  const cleanNumber = formattedNumber.replace(/^[^\d]+/, '').trim();
  return `GH₵ ${cleanNumber}`;
}

export function parseGHS(value: string): number {
  if (!value) return 0;
  const clean = value.replace(/[^0-9.-]+/g, '');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}
