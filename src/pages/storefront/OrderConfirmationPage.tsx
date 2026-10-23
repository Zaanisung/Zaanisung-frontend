import React from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatGHS } from '../../utils/currency';
import { CheckCircle2, Package, Truck, ArrowRight, Printer } from 'lucide-react';
import { getProductPlaceholderSvg } from '../../config/assets';

export const OrderConfirmationPage: React.FC = () => {
  const { selectedOrder, orders, navigateTo } = useApp();

  const order = selectedOrder || orders[0];

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl">No active order found</h2>
        <Button variant="outline" className="mt-4" onClick={() => navigateTo('home')}>
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 text-left">
      <Breadcrumbs
        items={[
          { label: 'Home', route: 'home' },
          { label: 'Order Confirmed' },
        ]}
      />

      {/* Confirmation Header Banner */}
      <div className="bg-[#FFFFFF] border border-[#E4DED3] p-8 sm:p-10 rounded-xs shadow-xs text-center mb-10">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} />
        </div>
        <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#92733C] block mb-1">
          Boutique Order Confirmed
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#171512] font-medium tracking-tight mb-2">
          Thank you, {order.customerName}
        </h1>
        <p className="text-xs sm:text-sm text-[#716C64] max-w-lg mx-auto leading-relaxed">
          Your order has been verified through Paystack. Our perfume atelier in Accra has initiated white-glove packaging.
        </p>

        <div className="mt-6 pt-6 border-t border-[#E4DED3] flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs">
          <div>
            <span className="text-[#716C64] block">Order Reference</span>
            <span className="font-serif text-base font-bold text-[#171512]">{order.reference}</span>
          </div>
          <div>
            <span className="text-[#716C64] block">Payment Status</span>
            <StatusBadge status={order.paymentStatus} type="payment" />
          </div>
          <div>
            <span className="text-[#716C64] block">Fulfillment</span>
            <StatusBadge status={order.fulfillmentStatus} type="fulfillment" />
          </div>
          <div>
            <span className="text-[#716C64] block">Tracking Code</span>
            <span className="font-mono text-xs font-semibold text-[#171512]">{order.trackingNumber || 'ZAA-EXP-9912'}</span>
          </div>
        </div>
      </div>

      {/* Itemized Order Details Card */}
      <div className="bg-[#FFFFFF] border border-[#E4DED3] p-6 sm:p-8 rounded-xs shadow-xs mb-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#E4DED3]">
          <h3 className="font-serif text-lg font-semibold text-[#171512]">
            Flacon Inventory & Allocation
          </h3>
          <span className="text-xs text-[#716C64]">
            {order.items.length} item{order.items.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="divide-y divide-[#E4DED3]">
          {order.items.map((item, idx) => {
            const fallback = getProductPlaceholderSvg(item.name, 'Woody');
            return (
              <div key={idx} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image || fallback}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallback;
                    }}
                    className="w-14 h-18 object-cover bg-[#F0ECE5] rounded-xs border border-[#E4DED3]"
                  />
                  <div>
                    <h4 className="font-serif text-base font-semibold text-[#171512]">{item.name}</h4>
                    <p className="text-xs text-[#716C64]">Volume: {item.size}</p>
                    <p className="text-xs text-[#716C64] mt-0.5">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-sm text-[#171512] tabular-nums">
                    {formatGHS(item.lineTotal)}
                  </span>
                  <p className="text-[11px] text-[#716C64] tabular-nums">
                    {formatGHS(item.unitPrice)} each
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Totals */}
        <div className="pt-4 border-t border-[#E4DED3] space-y-2 text-xs text-[#716C64]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-[#171512] font-semibold tabular-nums">{formatGHS(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Courier Logistics (Ghana Domestic)</span>
            <span className="text-[#171512] font-semibold tabular-nums">
              {order.shippingFee === 0 ? 'Complimentary' : formatGHS(order.shippingFee)}
            </span>
          </div>
          <div className="flex justify-between text-sm font-serif font-bold text-[#171512] pt-2 border-t border-[#E4DED3]">
            <span>Total Paid (GHS)</span>
            <span className="text-lg tabular-nums">{formatGHS(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Logistics and Destination Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-[#FFFFFF] border border-[#E4DED3] p-6 rounded-xs shadow-xs text-left">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-[#92733C]">
            <Truck size={14} />
            <span>Delivery Destination</span>
          </div>
          <p className="font-semibold text-sm text-[#171512] mb-1">
            {order.shippingAddress.fullName}
          </p>
          <p className="text-xs text-[#716C64] leading-relaxed">
            {order.shippingAddress.street}<br />
            {order.shippingAddress.city}, {order.shippingAddress.region}
          </p>
          <p className="text-xs text-[#716C64] mt-2">
            Phone: <span className="text-[#171512]">{order.shippingAddress.phone}</span>
          </p>
          {order.shippingAddress.additionalNotes && (
            <p className="text-xs text-[#92733C] mt-2 italic">
              Note: {order.shippingAddress.additionalNotes}
            </p>
          )}
        </div>

        <div className="bg-[#FFFFFF] border border-[#E4DED3] p-6 rounded-xs shadow-xs text-left">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-[#92733C]">
            <Package size={14} />
            <span>Handling Protocol</span>
          </div>
          <p className="text-xs text-[#716C64] leading-relaxed mb-3">
            Your flacons are placed in custom silk-lined boxes with velvet cushions and wax-sealed parchment certification.
          </p>
          <p className="text-xs text-[#171512] font-medium">
            Estimated Delivery: <span className="font-bold">{order.deliveryEstimatedDate || 'Within 48 Hours'}</span>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#E4DED3]">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          leftIcon={<Printer size={14} />}
        >
          Print Formal Receipt
        </Button>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateTo('account')}
          >
            View in Client Account
          </Button>
          <Button
            variant="gold"
            size="sm"
            onClick={() => navigateTo('catalog')}
            rightIcon={<ArrowRight size={14} />}
          >
            Continue Exploring
          </Button>
        </div>
      </div>
    </div>
  );
};
