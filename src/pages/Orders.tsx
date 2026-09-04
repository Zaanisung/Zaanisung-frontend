import React, { useState } from "react";
import { Order } from "../types";
import { Button } from "../components/Button";
import { ReceiptText, ChevronRight, ArrowLeft } from "lucide-react";

export interface OrdersProps {
  orders: Order[];
  onContinueShopping: () => void;
  selectedOrderId?: string | null;
}

export const Orders: React.FC<OrdersProps> = ({
  orders,
  onContinueShopping,
  selectedOrderId: initialSelectedId = null,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId);

  const selectedOrder = orders.find((o) => o.id === selectedId);

  if (orders.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto py-16 px-6 bg-white dark:bg-[#131317] border border-gray-200 dark:border-[#22222A] text-center flex flex-col items-center">
        <div className="w-14 h-14 bg-gray-100 dark:bg-[#1B1B22] flex items-center justify-center text-gray-400 mb-4 border border-gray-200 dark:border-[#282832]">
          <ReceiptText className="w-6 h-6 stroke-[1.5]" />
        </div>
        <h2
          className="text-xl font-light text-gray-900 dark:text-gray-100 mb-1"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          No orders yet
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
          When you purchase perfumes, your receipts and order updates will appear here.
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

  // If viewing single order detail
  if (selectedOrder) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <button
          type="button"
          onClick={() => setSelectedId(null)}
          className="min-h-[44px] inline-flex items-center text-xs uppercase tracking-widest text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all orders
        </button>

        <div className="bg-white dark:bg-[#131317] border border-gray-200 dark:border-[#22222A] p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 dark:border-[#22222A] pb-4 mb-6 gap-2">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 block">
                Order Reference
              </span>
              <h2 className="text-xl sm:text-2xl font-mono font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                {selectedOrder.id}
              </h2>
            </div>
            <div className="self-start sm:self-auto">
              <span className="inline-block px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-xs uppercase tracking-widest font-bold">
                {selectedOrder.status}
              </span>
            </div>
          </div>

          {/* Items Breakdown */}
          <div className="space-y-4 mb-8">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 font-bold">
              Ordered Fragrances
            </h3>
            <div className="divide-y divide-gray-100 dark:divide-[#202028]">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div>
                    <h4
                      className="font-brand-serif text-sm font-medium text-gray-900 dark:text-gray-100"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {item.name}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Quantity: {item.quantity} × {item.price.toFixed(2)} GHS
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100 font-mono">
                    {(item.price * item.quantity).toFixed(2)} GHS
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Logistics / Summary */}
          <div className="bg-gray-50 dark:bg-[#181820] p-4 border border-gray-200 dark:border-[#282834] space-y-2.5 text-xs sm:text-sm">
            {selectedOrder.customerName && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[11px]">Customer</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{selectedOrder.customerName}</span>
              </div>
            )}
            {selectedOrder.customerPhone && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[11px]">Phone</span>
                <span className="text-gray-900 dark:text-gray-100 font-mono">{selectedOrder.customerPhone}</span>
              </div>
            )}
            {selectedOrder.deliveryAddress && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[11px]">Address</span>
                <span className="text-gray-900 dark:text-gray-100 text-right max-w-xs">{selectedOrder.deliveryAddress}</span>
              </div>
            )}
            {selectedOrder.paymentMethod && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[11px]">Payment</span>
                <span className="text-gray-900 dark:text-gray-100">{selectedOrder.paymentMethod}</span>
              </div>
            )}
            <div className="pt-3 border-t border-gray-200 dark:border-[#282834] flex justify-between font-bold">
              <span className="uppercase tracking-widest text-gray-900 dark:text-gray-100">Total</span>
              <span className="text-base font-mono text-[#D4AF37]">
                {selectedOrder.total.toFixed(2)} GHS
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-[#22222A]">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onContinueShopping}
              className="w-full font-bold"
            >
              Order More Perfumes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Simple list (reference, total, status)
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-baseline justify-between border-b border-gray-200 dark:border-[#22222A] pb-4 mb-6">
        <h2
          className="text-2xl font-light text-gray-900 dark:text-gray-100"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          My Orders
        </h2>
        <span className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500">
          {orders.length} Records
        </span>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => setSelectedId(order.id)}
            className="p-4 sm:p-5 bg-white dark:bg-[#131317] border border-gray-200 dark:border-[#22222A] hover:border-[#D4AF37] dark:hover:border-[#D4AF37] shadow-xs cursor-pointer flex items-center justify-between transition-colors min-h-[56px]"
          >
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-bold text-gray-900 dark:text-gray-100">
                  {order.id}
                </span>
                {order.source && (
                  <span
                    className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 font-bold ${
                      order.source === "ONLINE"
                        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                        : "bg-purple-50 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                    }`}
                  >
                    {order.source}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
              </p>
            </div>

            <div className="flex items-center space-x-4 flex-shrink-0">
              <div className="text-right">
                <span className="text-sm sm:text-base font-bold font-mono text-[#D4AF37] block">
                  {order.total.toFixed(2)} GHS
                </span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold">
                  {order.status}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
