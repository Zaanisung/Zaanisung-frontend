import React from "react";
import { OrderItem, Product } from "../types";
import { CartItem } from "../components/CartItem";
import { Button } from "../components/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { ShoppingBag, ArrowRight } from "lucide-react";

export interface CartProps {
  items: OrderItem[];
  products: Product[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const Cart: React.FC<CartProps> = ({
  items,
  products,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping,
}) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="w-7 h-7 stroke-[1.5]" />}
        iconClassName="w-16 h-16"
        title="Your Bag is Empty"
        message="Explore our perfume collection and select your signature fragrance."
        action={
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={onContinueShopping}
            className="w-full font-bold"
          >
            Browse Perfumes
          </Button>
        }
      />
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="flex items-baseline justify-between pb-4">
        <div>
          <h2
            className="text-2xl sm:text-3xl font-light text-black dark:text-white font-brand-serif"
          >
            Shopping Bag
          </h2>
          <p className="text-[11px] uppercase tracking-widest text-gold font-semibold mt-0.5">
            Zaanisung Ent. GH Order
          </p>
        </div>
        <span className="text-xs uppercase tracking-widest text-black/45 dark:text-white/50">
          {items.reduce((s, i) => s + i.quantity, 0)} Items
        </span>
      </div>

      <div className="relative overflow-hidden surface-glass-strong p-4 sm:p-6 md:p-8 shadow-lift">
        <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true"></div>
        <div className="flex flex-col divide-y divide-black/10 dark:divide-white/10">
          {items.map((item) => {
            const product = products.find((p) => p.id === item.productId || p.name === item.name);
            const maxStock = product ? product.stock : 99;

            return (
              <CartItem
                key={item.productId || item.name}
                item={item}
                imageUrl={product?.imageUrl}
                maxStock={maxStock}
                onUpdateQuantity={(q) => onUpdateQuantity(item.productId || product?.id || "", q)}
                onRemove={() => onRemoveItem(item.productId || product?.id || "")}
              />
            );
          })}
        </div>

        {/* Summary & Checkout Action */}
        <div className="mt-8 flex flex-col gap-1">
          <div className="w-full hairline-black mb-2" aria-hidden="true"></div>
          <div className="flex items-center justify-between mb-2 text-xs uppercase tracking-wider text-black/50 dark:text-white/60">
            <span>Subtotal</span>
            <span className="font-mono">{total.toFixed(2)} GHS</span>
          </div>
          <div className="flex items-center justify-between mb-2 text-xs uppercase tracking-wider text-black/50 dark:text-white/60">
            <span>Estimated Ghana Shipping</span>
            <span className="text-gold dark:text-gold font-semibold">Free Delivery</span>
          </div>
          <div className="flex items-center justify-between mb-6 text-sm font-semibold text-black dark:text-white">
            <span className="uppercase tracking-widest text-xs sm:text-sm">Total Due</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-gold">
              {total.toFixed(2)} GHS
            </span>
          </div>

          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={onProceedToCheckout}
            className="w-full flex items-center justify-center gap-2 font-bold shadow-xs"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <button
            type="button"
            onClick={onContinueShopping}
            className="w-full mt-3 min-h-[44px] text-xs uppercase tracking-widest text-black/50 dark:text-white/50 hover:text-black dark:text-white dark:hover:text-white font-semibold text-center transition-colors"
          >
            ← Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
