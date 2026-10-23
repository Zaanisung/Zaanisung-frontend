import React from 'react';
import { useApp } from '../../context/AppContext';
import { Drawer } from '../common/Drawer';
import { Button } from '../common/Button';
import { formatGHS } from '../../utils/currency';
import { FREE_SHIPPING_THRESHOLD_GHS } from '../../utils/cart';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { getProductPlaceholderSvg } from '../../config/assets';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    navigateTo,
  } = useApp();

  const progressPercent = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD_GHS) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_GHS - cartSubtotal);

  return (
    <Drawer
      isOpen={isCartDrawerOpen}
      onClose={() => setIsCartDrawerOpen(false)}
      title="Shopping Flacon"
      subtitle={`${cart.length} unique creation${cart.length === 1 ? '' : 's'}`}
      width="md"
    >
      {cart.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center py-16">
          <div className="w-16 h-16 rounded-full bg-[#F0ECE5] flex items-center justify-center text-[#716C64] mb-4">
            <ShoppingBag size={24} />
          </div>
          <h4 className="font-serif text-lg font-medium text-[#171512] mb-1">Your Flacon is Empty</h4>
          <p className="text-xs text-[#716C64] max-w-xs mb-6">
            Explore our artisanal collection of Extraits de Parfum formulated in Accra.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setIsCartDrawerOpen(false);
              navigateTo('catalog');
            }}
          >
            Explore Fragrances
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-full justify-between">
          {/* Free Shipping Progress in Greater Accra */}
          <div className="mb-6 p-3 bg-[#F0ECE5] border border-[#E4DED3] rounded-xs">
            <div className="flex items-center justify-between text-xs text-[#171512] mb-1.5">
              <span className="font-medium">
                {remainingForFreeShipping === 0
                  ? 'Complimentary Greater Accra Courier Unlocked'
                  : `Add ${formatGHS(remainingForFreeShipping)} for Free Greater Accra Courier`}
              </span>
              <span className="tabular-nums font-semibold">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#E4DED3] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#B69A59] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="space-y-4 overflow-y-auto max-h-[50vh] pr-1">
            {cart.map((item) => {
              const fallback = getProductPlaceholderSvg(item.product.name, item.product.family);
              return (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-[#FFFFFF] border border-[#E4DED3] rounded-xs"
                >
                  <img
                    src={item.product.image || fallback}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallback;
                    }}
                    className="w-16 h-20 object-cover bg-[#F0ECE5] rounded-xs border border-[#E4DED3]/50 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="font-serif text-sm font-semibold text-[#171512] truncate">
                          {item.product.name}
                        </h5>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.product.name} from cart`}
                          className="text-[#A8A29E] hover:text-red-800 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#716C64]">{item.size} · {item.product.concentration}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E4DED3]/60">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#E4DED3] rounded-xs bg-[#FAF8F4]">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          aria-label="Decrease quantity"
                          className="p-1 hover:text-[#171512] text-[#716C64] transition-colors cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-xs font-semibold tabular-nums text-[#171512]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          aria-label="Increase quantity"
                          className="p-1 hover:text-[#171512] text-[#716C64] transition-colors cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Line Total */}
                      <span className="text-xs font-semibold text-[#171512] tabular-nums">
                        {formatGHS(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Drawer Footer Subtotal & CTAs */}
          <div className="pt-6 border-t border-[#E4DED3] mt-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-[#716C64]">Subtotal</span>
              <span className="font-serif text-xl font-bold text-[#171512] tabular-nums">
                {formatGHS(cartSubtotal)}
              </span>
            </div>
            <p className="text-[11px] text-[#716C64] mb-4">
              Taxes calculated at checkout. White-glove delivery applied based on Ghanaian shipping address.
            </p>
            <div className="space-y-2">
              <Button
                variant="gold"
                fullWidth
                size="md"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigateTo('checkout');
                }}
                rightIcon={<ArrowRight size={15} />}
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                fullWidth
                size="sm"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigateTo('cart');
                }}
              >
                View Full Flacon Bag
              </Button>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};
