import React from "react";
import { OrderItem, Product } from "../types";
import { CartItem } from "../components/CartItem";
import { Button } from "../components/Button";
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
      <div className="w-full max-w-md mx-auto py-16 px-6 bg-white dark:bg-[#131317] border border-gray-200 dark:border-[#22222A] text-center flex flex-col items-center shadow-xs">
        <div className="w-16 h-16 bg-gray-100 dark:bg-[#1C1C24] flex items-center justify-center text-gray-400 mb-4 border border-gray-200 dark:border-[#282834]">
          <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
        </div>
        <h2
          className="text-xl sm:text-2xl font-light text-gray-900 dark:text-gray-100 mb-1"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Your Bag is Empty
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
          Explore our perfume collection and select your signature fragrance.
        </p>
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onContinueShopping}
          className="w-full font-bold"
        >
          Browse Perfumes
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="flex items-baseline justify-between border-b border-gray-200 dark:border-[#22222A] pb-4">
        <div>
          <h2
            className="text-2xl sm:text-3xl font-light text-gray-900 dark:text-gray-100"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Shopping Bag
          </h2>
          <p className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold mt-0.5">
            Zaanisung Ent. GH Order
          </p>
        </div>
        <span className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500">
          {items.reduce((s, i) => s + i.quantity, 0)} Items
        </span>
      </div>

      <div className="bg-white dark:bg-[#131317] border border-gray-200 dark:border-[#22222A] p-4 sm:p-6 md:p-8 shadow-xs">
        <div className="divide-y divide-gray-100 dark:divide-[#202028]">
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
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-[#22222A]">
          <div className="flex items-center justify-between mb-2 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <span>Subtotal</span>
            <span className="font-mono">{total.toFixed(2)} GHS</span>
          </div>
          <div className="flex items-center justify-between mb-2 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <span>Estimated Ghana Shipping</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Free Delivery</span>
          </div>
          <div className="flex items-center justify-between mb-6 pt-3 border-t border-gray-100 dark:border-[#202028] text-sm font-semibold text-gray-900 dark:text-gray-100">
            <span className="uppercase tracking-widest text-xs sm:text-sm">Total Due</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-[#D4AF37]">
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
            className="w-full mt-3 min-h-[44px] text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white font-semibold text-center transition-colors"
          >
            ← Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
