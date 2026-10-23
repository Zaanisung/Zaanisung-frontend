/**
 * Shopping Cart and Order calculation utilities
 */

export interface CartCalculationItem {
  price: number;
  quantity: number;
}

export const FREE_SHIPPING_THRESHOLD_GHS = 1500;
export const STANDARD_DELIVERY_ACCRA_GHS = 50;
export const STANDARD_DELIVERY_REGIONAL_GHS = 90;
export const EXPRESS_DELIVERY_ACCRA_GHS = 90;

export function calculateLineTotal(price: number, quantity: number): number {
  if (price < 0 || quantity < 0) return 0;
  return Number((price * quantity).toFixed(2));
}

export function calculateSubtotal(items: CartCalculationItem[]): number {
  if (!items || items.length === 0) return 0;
  const sum = items.reduce((acc, item) => acc + calculateLineTotal(item.price, item.quantity), 0);
  return Number(sum.toFixed(2));
}

export function calculateShipping(
  subtotal: number,
  region: string = 'Greater Accra',
  isExpress = false
): number {
  if (subtotal <= 0) return 0;
  
  if (isExpress) {
    return EXPRESS_DELIVERY_ACCRA_GHS;
  }

  // Free delivery within Greater Accra on orders above threshold
  if (region.toLowerCase().includes('accra') && subtotal >= FREE_SHIPPING_THRESHOLD_GHS) {
    return 0;
  }

  if (region.toLowerCase().includes('accra')) {
    return STANDARD_DELIVERY_ACCRA_GHS;
  }

  return STANDARD_DELIVERY_REGIONAL_GHS;
}

export function calculateOrderTotal(
  subtotal: number,
  shipping: number,
  discount = 0
): number {
  const total = Math.max(0, subtotal + shipping - discount);
  return Number(total.toFixed(2));
}
