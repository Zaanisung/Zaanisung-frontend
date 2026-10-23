import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Button } from '../../components/common/Button';
import { formatGHS } from '../../utils/currency';
import { FREE_SHIPPING_THRESHOLD_GHS } from '../../utils/cart';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag, Gift, Check } from 'lucide-react';
import { getProductPlaceholderSvg } from '../../config/assets';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, cartSubtotal, navigateTo, addToast } = useApp();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const [isGift, setIsGift] = useState(false);
  const [giftNote, setGiftNote] = useState('');

  const progressPercent = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD_GHS) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_GHS - cartSubtotal);

  const discountAmount = Number(((cartSubtotal * discountPercent) / 100).toFixed(2));
  const finalTotal = Math.max(0, cartSubtotal - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'ACCRA10' || clean === 'WELCOME10' || clean === 'CONNOISSEUR') {
      setDiscountPercent(10);
      setPromoApplied(true);
      setPromoError('');
      addToast({
        type: 'success',
        title: 'Promotion Applied',
        message: '10% privilege discount applied to your flacon selection.',
      });
    } else {
      setPromoError('Invalid promotion code. Try ACCRA10');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in">
        <Breadcrumbs items={[{ label: 'Home', route: 'home' }, { label: 'Shopping Flacon' }]} />
        <div className="max-w-md mx-auto py-16 bg-[#FFFFFF] border border-[#E4DED3] rounded-xs p-8 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#F0ECE5] flex items-center justify-center text-[#716C64] mx-auto mb-4">
            <ShoppingBag size={24} />
          </div>
          <h2 className="font-serif text-2xl font-medium text-[#171512] mb-2">
            Your Shopping Bag is Empty
          </h2>
          <p className="text-xs text-[#716C64] mb-6 leading-relaxed">
            Discover our collection of Extraits de Parfum formulated with noble ingredients and aged resins in Accra.
          </p>
          <Button variant="primary" size="md" onClick={() => navigateTo('catalog')}>
            Explore Fragrance Repertoire
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-left animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', route: 'home' }, { label: 'Shopping Flacon' }]} />

      <div className="mb-8 pb-4 border-b border-[#E4DED3]">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#171512] font-normal tracking-tight">
          Your Shopping Flacon ({cart.reduce((a, b) => a + b.quantity, 0)} items)
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* LEFT COLUMN: ITEM LIST */}
        <div className="lg:col-span-8 space-y-6">
          {/* Free Shipping Notification */}
          <div className="p-4 bg-[#F0ECE5] border border-[#E4DED3] rounded-xs">
            <div className="flex items-center justify-between text-xs text-[#171512] mb-2 font-medium">
              <span>
                {remainingForFreeShipping === 0
                  ? 'Complimentary Greater Accra White-Glove Courier Unlocked'
                  : `Add ${formatGHS(remainingForFreeShipping)} more to qualify for Free Delivery in Greater Accra`}
              </span>
              <span className="tabular-nums font-bold">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#E4DED3] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#B69A59] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Table Header */}
          <div className="hidden sm:grid sm:grid-cols-12 text-xs uppercase tracking-wider text-[#716C64] pb-2 border-b border-[#E4DED3] px-2 font-semibold">
            <div className="col-span-6">Creation</div>
            <div className="col-span-2 text-center">Volume</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {/* Items */}
          <div className="divide-y divide-[#E4DED3] bg-[#FFFFFF] border border-[#E4DED3] rounded-xs shadow-xs">
            {cart.map((item) => {
              const fallback = getProductPlaceholderSvg(item.product.name, item.product.family);
              return (
                <div key={item.id} className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-12 items-center gap-4 transition-all">
                  {/* Product Details */}
                  <div className="sm:col-span-6 flex items-center gap-4">
                    <img
                      src={item.product.image || fallback}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallback;
                      }}
                      className="w-16 h-20 object-cover bg-[#F0ECE5] rounded-xs border border-[#E4DED3] shrink-0"
                    />
                    <div>
                      <h4 className="font-serif text-base font-semibold text-[#171512]">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-[#716C64]">
                        {item.product.brand} · {item.product.concentration}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="inline-flex items-center gap-1 text-[11px] text-red-800 hover:text-red-950 mt-2 transition-colors cursor-pointer"
                      >
                        <Trash2 size={12} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Size */}
                  <div className="sm:col-span-2 text-xs text-[#171512] font-medium sm:text-center">
                    <span className="sm:hidden text-[#716C64] mr-2">Volume:</span>
                    {item.size}
                  </div>

                  {/* Quantity Stepper */}
                  <div className="sm:col-span-2 flex items-center sm:justify-center">
                    <span className="sm:hidden text-xs text-[#716C64] mr-2">Quantity:</span>
                    <div className="flex items-center border border-[#E4DED3] rounded-xs bg-[#FAF8F4]">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        aria-label="Decrease quantity"
                        className="p-1.5 text-[#716C64] hover:text-[#171512] transition-colors cursor-pointer active:scale-95"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-3 text-xs font-semibold tabular-nums text-[#171512]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        aria-label="Increase quantity"
                        className="p-1.5 text-[#716C64] hover:text-[#171512] transition-colors cursor-pointer active:scale-95"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="sm:col-span-2 text-right">
                    <span className="sm:hidden text-xs text-[#716C64] mr-2">Line Total:</span>
                    <span className="text-sm font-semibold text-[#171512] tabular-nums">
                      {formatGHS(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Complimentary Concierge Gift Note Option */}
          <div className="p-5 bg-[#FFFFFF] border border-[#E4DED3] rounded-xs shadow-xs text-xs space-y-3">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-[#171512]">
              <input
                type="checkbox"
                checked={isGift}
                onChange={(e) => setIsGift(e.target.checked)}
                className="w-4 h-4 text-[#B69A59]"
              />
              <span className="flex items-center gap-1.5">
                <Gift size={14} className="text-[#92733C]" />
                This is a gift — include complimentary wax-sealed handwritten calligraphy card
              </span>
            </label>
            {isGift && (
              <div className="animate-fade-in pt-2">
                <textarea
                  rows={2}
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  placeholder="Enter recipient's name and your personal sentiment..."
                  className="w-full bg-[#FAF8F4] text-[#171512] p-3 border border-[#E4DED3] rounded-xs text-xs outline-none focus:border-[#171512]"
                />
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-between items-center text-xs">
            <button
              onClick={() => navigateTo('catalog')}
              className="text-[#92733C] hover:text-[#171512] underline underline-offset-4 cursor-pointer"
            >
              ← Continue Shopping Fragrances
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#E4DED3] p-6 sm:p-8 rounded-xs shadow-xs space-y-6">
          <h3 className="font-serif text-xl font-semibold text-[#171512] pb-4 border-b border-[#E4DED3]">
            Flacon Summary
          </h3>

          {/* Promo Code Input */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Privilege Code (try ACCRA10)"
                className="flex-1 bg-[#FAF8F4] text-[#171512] px-3 py-2 text-xs border border-[#E4DED3] rounded-xs outline-none focus:border-[#171512] uppercase"
              />
              <Button type="submit" variant="outline" size="sm">
                Apply
              </Button>
            </div>
            {promoApplied && (
              <p className="text-[11px] text-emerald-800 flex items-center gap-1 font-medium">
                <Check size={12} /> 10% privilege discount applied
              </p>
            )}
            {promoError && (
              <p className="text-[11px] text-red-800">{promoError}</p>
            )}
          </form>

          <div className="space-y-3 text-xs pt-2">
            <div className="flex items-center justify-between text-[#716C64]">
              <span>Bag Subtotal</span>
              <span className="text-[#171512] font-semibold tabular-nums text-sm">
                {formatGHS(cartSubtotal)}
              </span>
            </div>

            {promoApplied && (
              <div className="flex items-center justify-between text-emerald-800">
                <span>Privilege Discount (10%)</span>
                <span className="font-semibold tabular-nums">
                  - {formatGHS(discountAmount)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-[#716C64]">
              <span>Ghana Domestic Courier</span>
              <span className="text-[#171512]">
                {cartSubtotal >= FREE_SHIPPING_THRESHOLD_GHS ? 'Complimentary (Accra)' : 'Calculated at Checkout'}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E4DED3] flex items-center justify-between">
            <span className="font-serif text-lg font-semibold text-[#171512]">Estimated Total</span>
            <span className="font-serif text-2xl font-bold text-[#171512] tabular-nums">
              {formatGHS(finalTotal)}
            </span>
          </div>

          <Button
            variant="gold"
            size="lg"
            fullWidth
            onClick={() => navigateTo('checkout')}
            rightIcon={<ArrowRight size={16} />}
          >
            Proceed to Checkout
          </Button>

          <div className="pt-4 border-t border-[#E4DED3] flex items-center gap-2 text-[11px] text-[#716C64]">
            <ShieldCheck size={14} className="text-[#92733C] shrink-0" />
            <span>Encrypted Paystack checkout with MTN MoMo & Card</span>
          </div>
        </div>
      </div>
    </div>
  );
};
