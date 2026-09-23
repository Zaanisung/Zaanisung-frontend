import { useState, useCallback } from "react";
import type { Product, OrderItem } from "../../types";
import { STORAGE_KEYS } from "../../constants";
import { useLocalStorage } from "../../hooks/useLocalStorage";

/**
 * Cart slice: the persisted bag, the "recently added" flash, and the sliding
 * drawer that opens after every add. Takes the product list so quantities can
 * never exceed the live stock level.
 */
export function useCartData(products: Product[]) {
  // Cart is persisted to localStorage (F-05) so the bag survives page reloads.
  const [cart, setCart] = useLocalStorage<OrderItem[]>(STORAGE_KEYS.CART, []);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        const newQty = Math.min(product.stock, existing.quantity + quantity);
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [
        ...prev,
        {
          name: product.name,
          price: product.price,
          quantity: Math.min(product.stock, quantity),
          productId: product.id,
          // Snapshot the image with the item so it survives a reload and
          // renders correctly even before/without the live catalog lookup.
          imageUrl: product.imageUrl || "",
        },
      ];
    });
    setRecentlyAddedId(product.id);
    setTimeout(() => setRecentlyAddedId(null), 1500);
    setIsCartOpen(true);
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    const product = products.find((p) => p.id === productId);
    const maxStock = product ? product.stock : 99;
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(maxStock, quantity) }
          : item
      )
    );
  };

  const handleCartOpen = useCallback(() => setIsCartOpen(true), []);
  const handleCartClose = useCallback(() => setIsCartOpen(false), []);

  return {
    cart,
    setCart,
    recentlyAddedId,
    isCartOpen,
    onAddToCart: handleAddToCart,
    onUpdateCartQuantity: handleUpdateCartQuantity,
    onRemoveCartItem: handleRemoveCartItem,
    onCartOpen: handleCartOpen,
    onCartClose: handleCartClose,
  };
}