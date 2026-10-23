import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { formatGHS } from '../../utils/currency';
import { calculateShipping, calculateOrderTotal } from '../../utils/cart';
import { validateEmail, validateGhanaPhone } from '../../utils/validation';
import { ShieldCheck, Lock, CreditCard, Smartphone, CheckCircle2, ArrowLeft } from 'lucide-react';

const GHANA_REGIONS = [
  { value: 'Greater Accra', label: 'Greater Accra' },
  { value: 'Ashanti Region', label: 'Ashanti Region' },
  { value: 'Western Region', label: 'Western Region' },
  { value: 'Central Region', label: 'Central Region' },
  { value: 'Eastern Region', label: 'Eastern Region' },
  { value: 'Northern Region', label: 'Northern Region' },
  { value: 'Volta Region', label: 'Volta Region' },
  { value: 'Upper East', label: 'Upper East' },
  { value: 'Upper West', label: 'Upper West' },
  { value: 'Bono Region', label: 'Bono Region' },
];

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, currentUser, createOrder, navigateTo } = useApp();

  // Form Fields
  const [email, setEmail] = useState(currentUser?.email || '');
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [street, setStreet] = useState(currentUser?.addresses[0]?.street || '');
  const [city, setCity] = useState(currentUser?.addresses[0]?.city || '');
  const [region, setRegion] = useState(currentUser?.addresses[0]?.region || 'Greater Accra');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isExpress, setIsExpress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'mobile_money' | 'card_on_delivery'>('paystack');

  // Form Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Paystack Modal State
  const [isPaystackOpen, setIsPaystackOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paystackChannel, setPaystackChannel] = useState<'card' | 'momo'>('card');
  const [momoProvider, setMomoProvider] = useState<'mtn' | 'telecel' | 'at'>('mtn');

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl">Your Flacon Bag is empty</h2>
        <Button variant="outline" className="mt-4" onClick={() => navigateTo('catalog')}>
          Return to Catalog
        </Button>
      </div>
    );
  }

  const shippingFee = calculateShipping(cartSubtotal, region, isExpress);
  const grandTotal = calculateOrderTotal(cartSubtotal, shippingFee, 0);

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!validateEmail(email)) errs.email = 'Valid email required for order confirmation';
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!validateGhanaPhone(phone)) errs.phone = 'Valid Ghana phone number required (e.g. 0244123456)';
    if (!street.trim()) errs.street = 'Street address / landmarks required';
    if (!city.trim()) errs.city = 'Town / City is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsPaystackOpen(true);
  };

  const handleCompletePaystackPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsPaystackOpen(false);

      // Create actual verified order
      const newOrder = createOrder({
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        items: cart.map((i) => ({
          productId: i.productId,
          name: i.product.name,
          size: i.size,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          lineTotal: i.unitPrice * i.quantity,
          image: i.product.image,
        })),
        subtotal: cartSubtotal,
        shippingFee: shippingFee,
        discount: 0,
        total: grandTotal,
        shippingAddress: {
          id: `addr-${Date.now()}`,
          label: 'Delivery Address',
          fullName,
          phone,
          street,
          city,
          region,
          additionalNotes: deliveryNotes,
          isDefault: false,
        },
        paymentMethod: paymentMethod,
        paymentStatus: 'paid',
        fulfillmentStatus: 'processing',
        paystackReference: `pstk_${Date.now().toString(36)}`,
      });

      navigateTo('order-confirmation', { orderId: newOrder.id });
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-left">
      <Breadcrumbs
        items={[
          { label: 'Home', route: 'home' },
          { label: 'Flacon Bag', route: 'cart' },
          { label: 'Checkout' },
        ]}
      />

      <div className="mb-8 pb-4 border-b border-[#E4DED3]">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#171512] font-normal tracking-tight">
          Secure Checkout
        </h1>
        <p className="text-xs text-[#716C64] mt-1 font-light">
          Encrypted transaction processed via Paystack Ghana. All amounts in Ghanaian Cedis (GHS).
        </p>
      </div>

      <form onSubmit={handleInitiatePayment}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT COLUMN: CUSTOMER & DELIVERY FORMS */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Customer Contact */}
            <div className="bg-[#FFFFFF] border border-[#E4DED3] p-6 sm:p-8 rounded-xs shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#E4DED3]">
                <span className="text-xs font-bold text-[#B69A59]">01</span>
                <h3 className="font-serif text-lg font-semibold text-[#171512]">
                  Client Contact Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address (For Order Receipt)"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  placeholder="kwame@example.com"
                  required
                />
                <Input
                  label="Ghana Phone Number (For Courier)"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={errors.phone}
                  placeholder="0244 123 456"
                  required
                />
              </div>
            </div>

            {/* Step 2: Shipping Destination */}
            <div className="bg-[#FFFFFF] border border-[#E4DED3] p-6 sm:p-8 rounded-xs shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#E4DED3]">
                <span className="text-xs font-bold text-[#B69A59]">02</span>
                <h3 className="font-serif text-lg font-semibold text-[#171512]">
                  Ghana Delivery Destination
                </h3>
              </div>

              <div className="space-y-4">
                <Input
                  label="Full Name of Recipient"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  error={errors.fullName}
                  placeholder="Nana Kwame Mensah"
                  required
                />

                <Input
                  label="Street Address / House No. / Landmark"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  error={errors.street}
                  placeholder="House 12, Patrice Lumumba Road (Near French School)"
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="City / Suburb / Town"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    error={errors.city}
                    placeholder="Airport Residential, Accra"
                    required
                  />
                  <Select
                    label="Ghana Administrative Region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    options={GHANA_REGIONS}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-[#716C64] mb-1.5">
                    Courier Delivery Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. Leave with gate security concierge, or call upon arrival."
                    className="w-full bg-[#FFFFFF] text-[#171512] px-3.5 py-2.5 text-sm border border-[#E4DED3] rounded-xs focus:border-[#171512] outline-none"
                  />
                </div>
              </div>

              {/* Delivery Speed Selector */}
              <div className="mt-6 pt-6 border-t border-[#E4DED3] space-y-3">
                <span className="block text-xs uppercase tracking-wider font-semibold text-[#716C64]">
                  Courier Delivery Method
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setIsExpress(false)}
                    className={`p-3.5 border rounded-xs cursor-pointer transition-all ${
                      !isExpress
                        ? 'border-[#171512] bg-[#FAF8F4]'
                        : 'border-[#E4DED3] bg-white hover:border-[#171512]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-[#171512]">Standard Courier</span>
                      <span className="text-xs font-bold text-[#171512] tabular-nums">
                        {calculateShipping(cartSubtotal, region, false) === 0 ? 'FREE' : formatGHS(calculateShipping(cartSubtotal, region, false))}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#716C64]">
                      24–48 hours across Greater Accra & regional hubs
                    </p>
                  </div>

                  <div
                    onClick={() => setIsExpress(true)}
                    className={`p-3.5 border rounded-xs cursor-pointer transition-all ${
                      isExpress
                        ? 'border-[#171512] bg-[#FAF8F4]'
                        : 'border-[#E4DED3] bg-white hover:border-[#171512]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-[#171512]">Express VIP Same-Day</span>
                      <span className="text-xs font-bold text-[#171512] tabular-nums">
                        {formatGHS(90)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#716C64]">
                      Same-day expedited dispatch (Accra only)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method Selection */}
            <div className="bg-[#FFFFFF] border border-[#E4DED3] p-6 sm:p-8 rounded-xs shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#E4DED3]">
                <span className="text-xs font-bold text-[#B69A59]">03</span>
                <h3 className="font-serif text-lg font-semibold text-[#171512]">
                  Payment Authorization
                </h3>
              </div>

              <div className="space-y-3">
                <div
                  onClick={() => setPaymentMethod('paystack')}
                  className={`p-4 border rounded-xs cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'paystack'
                      ? 'border-[#171512] bg-[#FAF8F4]'
                      : 'border-[#E4DED3] bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#171512] text-[#B69A59] rounded-xs">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#171512]">
                        Paystack Gateway (Cards & Ghana Mobile Money)
                      </div>
                      <p className="text-[11px] text-[#716C64]">
                        MTN MoMo, Telecel Cash, Visa, Mastercard, Verve
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-[#92733C] font-semibold">Recommended</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY */}
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E4DED3] p-6 sm:p-8 rounded-xs shadow-xs space-y-6 lg:sticky lg:top-28">
            <h3 className="font-serif text-xl font-semibold text-[#171512] pb-4 border-b border-[#E4DED3]">
              Order Summary
            </h3>

            {/* Itemized List */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-[#716C64]">{item.quantity}×</span>
                    <div>
                      <p className="font-medium text-[#171512]">{item.product.name}</p>
                      <p className="text-[11px] text-[#716C64]">{item.size}</p>
                    </div>
                  </div>
                  <span className="font-medium text-[#171512] tabular-nums">
                    {formatGHS(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-[#E4DED3] space-y-2.5 text-xs text-[#716C64]">
              <div className="flex items-center justify-between">
                <span>Flacon Subtotal</span>
                <span className="text-[#171512] font-semibold tabular-nums">{formatGHS(cartSubtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Courier Logistics</span>
                <span className="text-[#171512] font-semibold tabular-nums">
                  {shippingFee === 0 ? 'Complimentary' : formatGHS(shippingFee)}
                </span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="pt-4 border-t border-[#E4DED3] flex items-center justify-between">
              <span className="font-serif text-lg font-semibold text-[#171512]">Total Amount</span>
              <span className="font-serif text-2xl font-bold text-[#171512] tabular-nums">
                {formatGHS(grandTotal)}
              </span>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              fullWidth
              leftIcon={<Lock size={16} />}
            >
              Authorize & Pay {formatGHS(grandTotal)}
            </Button>

            <div className="pt-4 border-t border-[#E4DED3] space-y-2 text-[11px] text-[#716C64]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#92733C] shrink-0" />
                <span>PCI-DSS Level 1 Encrypted Integration</span>
              </div>
              <p>
                By authorizing this purchase you agree to ZAANISUNG terms of boutique sales and Ghana delivery guidelines.
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* PAYSTACK PAYMENT PROCESSING MODAL SIMULATION */}
      <Modal
        isOpen={isPaystackOpen}
        onClose={() => !isProcessingPayment && setIsPaystackOpen(false)}
        maxWidth="md"
        title="Paystack Checkout"
        subtitle="Secured by Paystack Payments Limited"
      >
        <div className="text-left space-y-5">
          <div className="bg-[#FAF8F4] p-4 border border-[#E4DED3] rounded-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#716C64] uppercase tracking-wider block">Merchant</span>
              <span className="font-serif text-base font-semibold text-[#171512]">ZAANISUNG GHANA</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#716C64] uppercase tracking-wider block">Amount Due</span>
              <span className="font-serif text-lg font-bold text-[#171512] tabular-nums">
                {formatGHS(grandTotal)}
              </span>
            </div>
          </div>

          {/* Paystack Channel Selector */}
          <div className="flex border-b border-[#E4DED3]">
            <button
              type="button"
              onClick={() => setPaystackChannel('card')}
              className={`flex-1 py-2.5 text-xs font-semibold text-center transition-colors border-b-2 cursor-pointer ${
                paystackChannel === 'card'
                  ? 'border-[#0BA4DB] text-[#0BA4DB]'
                  : 'border-transparent text-[#716C64] hover:text-[#171512]'
              }`}
            >
              Card (Visa / Mastercard)
            </button>
            <button
              type="button"
              onClick={() => setPaystackChannel('momo')}
              className={`flex-1 py-2.5 text-xs font-semibold text-center transition-colors border-b-2 cursor-pointer ${
                paystackChannel === 'momo'
                  ? 'border-[#0BA4DB] text-[#0BA4DB]'
                  : 'border-transparent text-[#716C64] hover:text-[#171512]'
              }`}
            >
              Ghana Mobile Money
            </button>
          </div>

          {paystackChannel === 'card' ? (
            <div className="space-y-3">
              <Input
                label="Card Number"
                placeholder="4084 ···· ···· 1234"
                defaultValue="4084 0000 0000 1234"
                readOnly
              />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Valid Thru" defaultValue="08/28" readOnly />
                <Input label="CVV" defaultValue="···" readOnly />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-wider font-medium text-[#716C64]">
                Select Network Provider
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'mtn', name: 'MTN MoMo' },
                  { id: 'telecel', name: 'Telecel Cash' },
                  { id: 'at', name: 'AT Money' },
                ].map((prov) => (
                  <button
                    key={prov.id}
                    type="button"
                    onClick={() => setMomoProvider(prov.id as any)}
                    className={`p-2.5 border rounded-xs text-xs font-semibold transition-all cursor-pointer ${
                      momoProvider === prov.id
                        ? 'border-[#0BA4DB] bg-[#0BA4DB]/10 text-[#0BA4DB]'
                        : 'border-[#E4DED3] bg-white text-[#171512]'
                    }`}
                  >
                    {prov.name}
                  </button>
                ))}
              </div>
              <Input
                label="Mobile Money Number"
                defaultValue={phone || '0244123456'}
                readOnly
              />
            </div>
          )}

          <div className="pt-4 border-t border-[#E4DED3] flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isProcessingPayment}
              onClick={() => setIsPaystackOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              isLoading={isProcessingPayment}
              onClick={handleCompletePaystackPayment}
            >
              Authorize {formatGHS(grandTotal)}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
