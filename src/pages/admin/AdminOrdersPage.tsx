import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatGHS } from '../../utils/currency';
import { FulfillmentStatus, PaymentStatus, Order } from '../../types';
import { Search, Eye, Filter, CheckCircle2 } from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const { orders, updateOrderFulfillment, updateOrderPayment } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [fulfillmentFilter, setFulfillmentFilter] = useState<string>('All');
  const [activeOrderModal, setActiveOrderModal] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.shippingAddress.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFulfillment =
      fulfillmentFilter === 'All' || o.fulfillmentStatus === fulfillmentFilter;
    return matchSearch && matchFulfillment;
  });

  return (
    <div className="flex-1 min-h-screen bg-[#FAF8F4] flex flex-col text-left">
      <AdminHeader
        title="Order Management"
        subtitle={`Tracking ${orders.length} total customer orders & Ghana courier dispatches`}
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
        {/* Controls */}
        <div className="bg-[#FFFFFF] border border-[#E4DED3] p-4 rounded-xs shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order ref #ZAA, customer, or city..."
              className="w-full bg-[#FAF8F4] text-[#171512] pl-9 pr-4 py-2 text-xs border border-[#E4DED3] rounded-xs focus:border-[#171512] outline-none"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#716C64]" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#716C64]">Status:</span>
            <select
              value={fulfillmentFilter}
              onChange={(e) => setFulfillmentFilter(e.target.value)}
              className="bg-[#FAF8F4] text-xs border border-[#E4DED3] rounded-xs px-3 py-2 outline-none cursor-pointer"
            >
              <option value="All">All Fulfillments</option>
              <option value="processing">Processing</option>
              <option value="shipped">Dispatched / Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-xs shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F4] text-[#716C64] uppercase tracking-wider text-[11px] border-b border-[#E4DED3]">
                <tr>
                  <th className="px-5 py-3.5">Order Ref</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Client Information</th>
                  <th className="px-5 py-3.5">Total (GHS)</th>
                  <th className="px-5 py-3.5">Payment</th>
                  <th className="px-5 py-3.5">Fulfillment</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4DED3]">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF8F4]/80 transition-colors">
                    <td className="px-5 py-3.5 font-serif font-bold text-[#171512]">
                      {ord.reference}
                    </td>
                    <td className="px-5 py-3.5 text-[#716C64]">
                      {new Date(ord.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-5 py-3.5 text-[#171512]">
                      <div className="font-medium">{ord.customerName}</div>
                      <div className="text-[11px] text-[#716C64]">
                        {ord.shippingAddress.city}, {ord.shippingAddress.region}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-bold tabular-nums text-[#171512]">
                      {formatGHS(ord.total)}
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={ord.paymentStatus}
                        onChange={(e) => updateOrderPayment(ord.id, e.target.value as PaymentStatus)}
                        className="bg-[#FAF8F4] text-xs border border-[#E4DED3] rounded-xs px-2 py-1 outline-none cursor-pointer"
                      >
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={ord.fulfillmentStatus}
                        onChange={(e) => updateOrderFulfillment(ord.id, e.target.value as FulfillmentStatus)}
                        className="bg-[#FAF8F4] text-xs border border-[#E4DED3] rounded-xs px-2 py-1 outline-none cursor-pointer"
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveOrderModal(ord)}
                        leftIcon={<Eye size={12} />}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {activeOrderModal && (
        <Modal
          isOpen={!!activeOrderModal}
          onClose={() => setActiveOrderModal(null)}
          title={`Order ${activeOrderModal.reference}`}
          subtitle={`Placed on ${new Date(activeOrderModal.createdAt).toLocaleDateString('en-GB')}`}
          maxWidth="lg"
        >
          <div className="text-left space-y-4">
            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-[#E4DED3] text-xs">
              <div>
                <span className="text-[#716C64] block">Client Name</span>
                <span className="font-semibold text-[#171512]">{activeOrderModal.customerName}</span>
                <span className="text-[#716C64] block">{activeOrderModal.customerEmail}</span>
                <span className="text-[#716C64] block">{activeOrderModal.customerPhone}</span>
              </div>
              <div className="text-right">
                <span className="text-[#716C64] block">Shipping Method</span>
                <span className="font-semibold text-[#171512]">White-Glove Courier</span>
                <span className="text-[#716C64] block">Tracking: {activeOrderModal.trackingNumber || 'ZAA-EXP-9912'}</span>
              </div>
            </div>

            <div className="p-3 bg-[#FAF8F4] border border-[#E4DED3] rounded-xs text-xs text-[#716C64]">
              <strong className="text-[#171512] block mb-1">Delivery Destination:</strong>
              <p>{activeOrderModal.shippingAddress.street}</p>
              <p>{activeOrderModal.shippingAddress.city}, {activeOrderModal.shippingAddress.region}</p>
              {activeOrderModal.shippingAddress.additionalNotes && (
                <p className="mt-1 text-[#92733C] italic">Note: {activeOrderModal.shippingAddress.additionalNotes}</p>
              )}
            </div>

            {/* Items */}
            <div className="divide-y divide-[#E4DED3]">
              {activeOrderModal.items.map((i, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#171512]">{i.name}</span>
                    <p className="text-[#716C64]">{i.size} · Qty: {i.quantity}</p>
                  </div>
                  <span className="font-bold tabular-nums text-[#171512]">{formatGHS(i.lineTotal)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E4DED3] flex justify-between items-center text-sm font-serif font-bold text-[#171512]">
              <span>Total Paid:</span>
              <span className="text-lg tabular-nums">{formatGHS(activeOrderModal.total)}</span>
            </div>

            <div className="pt-3 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setActiveOrderModal(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
