import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatGHS } from '../../utils/currency';
import { 
  TrendingUp, 
  ShoppingBag, 
  AlertTriangle, 
  Users, 
  ArrowRight,
  PackageCheck
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { adminStats, orders, products, navigateTo } = useApp();

  const lowStockProducts = products.filter((p) => p.stock <= 5);

  return (
    <div className="flex-1 min-h-screen bg-[#FAF8F4] flex flex-col text-left">
      <AdminHeader
        title="Operations Dashboard"
        subtitle="Live metrics from ZAANISUNG Accra e-commerce infrastructure"
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl">
        {/* Metric Cards (Tabular figures, high legibility) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 bg-[#FFFFFF] border border-[#E4DED3] rounded-xs shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#716C64] uppercase tracking-wider mb-2">
              <span>Gross Sales (GHS)</span>
              <TrendingUp size={16} className="text-emerald-700" />
            </div>
            <div className="font-serif text-3xl font-bold text-[#171512] tabular-nums">
              {formatGHS(adminStats.grossSalesGHS, false)}
            </div>
            <p className="text-[11px] text-[#716C64] mt-1.5 font-light">
              Verified through Paystack settlement
            </p>
          </div>

          <div className="p-6 bg-[#FFFFFF] border border-[#E4DED3] rounded-xs shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#716C64] uppercase tracking-wider mb-2">
              <span>Total Orders Placed</span>
              <ShoppingBag size={16} className="text-[#92733C]" />
            </div>
            <div className="font-serif text-3xl font-bold text-[#171512] tabular-nums">
              {orders.length}
            </div>
            <p className="text-[11px] text-[#716C64] mt-1.5 font-light">
              Across Greater Accra & regions
            </p>
          </div>

          <div className="p-6 bg-[#FFFFFF] border border-[#E4DED3] rounded-xs shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#716C64] uppercase tracking-wider mb-2">
              <span>Pending Logistics</span>
              <PackageCheck size={16} className="text-[#B69A59]" />
            </div>
            <div className="font-serif text-3xl font-bold text-[#171512] tabular-nums">
              {orders.filter((o) => o.fulfillmentStatus === 'processing').length}
            </div>
            <p className="text-[11px] text-[#716C64] mt-1.5 font-light">
              Awaiting white-glove dispatch
            </p>
          </div>

          <div className="p-6 bg-[#FFFFFF] border border-[#E4DED3] rounded-xs shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#716C64] uppercase tracking-wider mb-2">
              <span>Low Reserve Flacons</span>
              <AlertTriangle size={16} className="text-red-800" />
            </div>
            <div className="font-serif text-3xl font-bold text-red-900 tabular-nums">
              {lowStockProducts.length}
            </div>
            <p className="text-[11px] text-[#716C64] mt-1.5 font-light">
              Inventory ≤ 5 units in Accra stock
            </p>
          </div>
        </div>

        {/* Section: Operational Tables Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Recent Orders Queue */}
          <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E4DED3] rounded-xs shadow-xs">
            <div className="p-5 border-b border-[#E4DED3] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#171512]">
                  Recent Orders Queue
                </h3>
                <p className="text-xs text-[#716C64]">Real-time customer transactions requiring dispatch.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateTo('admin-orders')}
                rightIcon={<ArrowRight size={13} />}
              >
                All Orders
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F4] text-[#716C64] uppercase tracking-wider text-[11px] border-b border-[#E4DED3]">
                  <tr>
                    <th className="px-5 py-3">Order Ref</th>
                    <th className="px-5 py-3">Client</th>
                    <th className="px-5 py-3">Items</th>
                    <th className="px-5 py-3">Total (GHS)</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4DED3]">
                  {orders.slice(0, 5).map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#FAF8F4]/80 transition-colors">
                      <td className="px-5 py-3.5 font-bold font-serif text-[#171512]">
                        {ord.reference}
                      </td>
                      <td className="px-5 py-3.5 text-[#171512]">
                        <div className="font-medium">{ord.customerName}</div>
                        <div className="text-[11px] text-[#716C64]">{ord.shippingAddress.city}</div>
                      </td>
                      <td className="px-5 py-3.5 text-[#716C64]">
                        {ord.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                      </td>
                      <td className="px-5 py-3.5 font-semibold tabular-nums text-[#171512]">
                        {formatGHS(ord.total)}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={ord.fulfillmentStatus} type="fulfillment" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Alerts & Quick Restock */}
          <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#E4DED3] rounded-xs shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4DED3]">
              <h3 className="font-serif text-base font-semibold text-[#171512]">
                Inventory Alerts
              </h3>
              <span className="text-[11px] text-red-800 font-bold uppercase tracking-wider">
                {lowStockProducts.length} Items Critical
              </span>
            </div>

            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-[#716C64] py-4 text-center">
                All inventory flacons are healthy.
              </p>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-[#FAF8F4] border border-[#E4DED3] rounded-xs flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-[#171512]">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-[#716C64]">
                        Remaining: <strong className="text-red-800">{p.stock} flacons</strong>
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateTo('admin-product-edit', { productId: p.id })}
                    >
                      Restock
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2">
              <Button
                variant="gold"
                size="sm"
                fullWidth
                onClick={() => navigateTo('admin-product-new')}
              >
                + Register New Formulation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
