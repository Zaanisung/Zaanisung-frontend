import React, { useEffect } from "react";
import { OrderItem, Product } from "../types";
import { cn } from "../utils/cn";
import { ProductImage } from "./ui/ProductImage";
import { QuantityStepper } from "./ui/QuantityStepper";
import { Button } from "./Button";
import { ShoppingBag, X, ArrowRight, Trash2 } from "lucide-react";

export interface MiniCartDrawerProps {
  open: boolean;
  items: OrderItem[];
  products: Product[];
  onClose: () => void;
  onViewBag: () => void;
  onCheckout: () => void;
  onBrowse: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

/**
 * Global slide-in bag. Opens automatically whenever an item is added so the
 * user always knows where their selection is going; from here they can keep
 * shopping, view the full bag, or jump straight to checkout.
 */
export const MiniCartDrawer: React.FC<MiniCartDrawerProps> = ({
  open,
  items,
  products,
  onClose,
  onViewBag,
  onCheckout,
  onBrowse,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-[80] bg-ink/45 backdrop-blur-[2px] transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Shopping bag, ${count} ${count === 1 ? "item" : "items"}`}
        aria-hidden={!open}
        className={cn(
          "fixed top-0 right-0 bottom-0 z-[90] w-full max-w-md flex flex-col",
          "bg-cream dark:bg-ink border-l border-black/15 dark:border-white/15",
          "shadow-[0_0_60px_-12px_rgba(0,0,0,0.45)]",
          "transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        )}
      >
        {/* Gold hairline crown */}
        <div className="absolute top-0 inset-x-0 hairline-gold z-10" aria-hidden="true" />

        {/* Header */}
        <div className="relative flex items-center justify-between px-5 pt-6 pb-4 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-gold" />
            <h2 className="font-brand-serif text-lg font-light text-ink dark:text-cream tracking-wide">
              Your Bag
            </h2>
            <span className="text-[10px] uppercase tracking-widest font-bold bg-gold text-ink px-1.5 py-0.5 rounded">
              {count}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-black/50 dark:text-white/50 hover:text-gold transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto scrollbar-none px-5">
          {items.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-xl surface-glass-tint border border-gold/40 flex items-center justify-center text-gold mb-4">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-brand-serif text-base text-ink dark:text-cream mb-1">
                Your bag is empty
              </h3>
              <p className="text-xs text-black/50 dark:text-white/50 mb-6">
                Add a signature fragrance to get started.
              </p>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={onBrowse}
                className="w-full max-w-[220px]"
              >
                Browse Perfumes
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-black/10 dark:divide-white/10">
              {items.map((item) => {
                const product = products.find(
                  (p) => p.id === item.productId || p.name === item.name
                );
                const maxStock = product ? product.stock : 99;
                const productId = item.productId || product?.id || "";
                return (
                  <li key={item.productId || item.name} className="py-4 flex gap-3">
                    <div className="w-16 h-20 flex-shrink-0 surface-glass border border-black/10 dark:border-white/15 overflow-hidden relative rounded-lg">
                      <ProductImage src={product?.imageUrl} alt={item.name} className="w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-brand-serif text-sm text-ink dark:text-cream truncate">
                          {item.name}
                        </h4>
                        <span className="text-xs font-bold font-mono text-gold flex-shrink-0">
                          {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[11px] text-black/50 dark:text-white/50 mt-0.5">
                        {item.price.toFixed(2)} GHS each
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <QuantityStepper
                          quantity={item.quantity}
                          max={maxStock}
                          onDecrease={() => onUpdateQuantity(productId, item.quantity - 1)}
                          onIncrease={() => onUpdateQuantity(productId, item.quantity + 1)}
                        />
                        <button
                          type="button"
                          onClick={() => onRemoveItem(productId)}
                          aria-label={`Remove ${item.name}`}
                          className="min-h-[44px] px-2 text-black/45 dark:text-white/45 hover:text-red-600 transition-colors flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="text-[10px] uppercase tracking-wider">Remove</span>
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="relative flex-shrink-0 border-t border-black/10 dark:border-white/10 px-5 pb-6 pt-4">
            <div className="flex items-center justify-between mb-1 text-xs uppercase tracking-wider text-black/50 dark:text-white/60">
              <span>Subtotal</span>
              <span className="font-mono">{total.toFixed(2)} GHS</span>
            </div>
            <div className="flex items-center justify-between mb-4 text-xs uppercase tracking-wider text-black/50 dark:text-white/60">
              <span>Ghana Delivery</span>
              <span className="text-gold font-semibold">Free</span>
            </div>

            <Button type="button" variant="primary" size="lg" onClick={onCheckout} className="w-full">
              <span>Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <button
              type="button"
              onClick={onViewBag}
              className="w-full mt-3 min-h-[44px] text-[11px] uppercase tracking-widest font-semibold text-black/50 dark:text-white/50 hover:text-ink dark:hover:text-cream transition-colors"
            >
              View Full Bag ({count})
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full min-h-[44px] text-[10px] uppercase tracking-[0.2em] text-gold hover:underline"
            >
              ← Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
};