import React from 'react';
import { useApp, AppRoute } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  ExternalLink,
  PlusCircle,
  ShieldCheck
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const { currentRoute, navigateTo, products, orders } = useApp();

  const lowStockCount = products.filter((p) => p.stock <= 5).length;
  const pendingOrdersCount = orders.filter((o) => o.fulfillmentStatus === 'processing').length;

  const navItems = [
    {
      id: 'admin-dashboard' as AppRoute,
      label: 'Dashboard',
      icon: <LayoutDashboard size={16} />,
    },
    {
      id: 'admin-products' as AppRoute,
      label: 'Inventory & Products',
      icon: <Package size={16} />,
      badge: lowStockCount > 0 ? `${lowStockCount} low` : undefined,
      badgeColor: 'text-[#92733C] bg-[#2A241F]',
    },
    {
      id: 'admin-orders' as AppRoute,
      label: 'Order Management',
      icon: <ShoppingBag size={16} />,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} new` : undefined,
      badgeColor: 'text-emerald-400 bg-emerald-950/60',
    },
    {
      id: 'admin-users' as AppRoute,
      label: 'Customers & Users',
      icon: <Users size={16} />,
    },
    {
      id: 'admin-settings' as AppRoute,
      label: 'Commerce Settings',
      icon: <Settings size={16} />,
    },
  ];

  return (
    <aside className="w-64 bg-[#171512] text-[#F8F5EF] flex flex-col shrink-0 border-r border-[#2A241F] min-h-screen">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#2A241F] flex items-center justify-between">
        <div>
          <span className="font-serif text-lg tracking-[0.2em] font-semibold text-[#F8F5EF] block">
            ZAANISUNG
          </span>
          <span className="text-[10px] uppercase tracking-wider text-[#B69A59] font-medium flex items-center gap-1 mt-0.5">
            <ShieldCheck size={11} />
            Commerce Admin
          </span>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="p-4">
        <button
          onClick={() => navigateTo('admin-product-new')}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#B69A59] hover:bg-[#A38747] text-[#171512] text-xs font-semibold rounded-xs transition-colors cursor-pointer"
        >
          <PlusCircle size={14} />
          <span>New Perfume Flacon</span>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = currentRoute === item.id || 
            (item.id === 'admin-products' && (currentRoute === 'admin-product-new' || currentRoute === 'admin-product-edit')) ||
            (item.id === 'admin-orders' && currentRoute === 'admin-order-detail');

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-xs transition-colors cursor-pointer text-left ${
                isActive
                  ? 'bg-[#2A241F] text-[#F8F5EF] border-l-2 border-[#B69A59]'
                  : 'text-[#A8A29E] hover:text-[#FFFFFF] hover:bg-[#2A241F]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-[#B69A59]' : 'text-[#716C64]'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-xs font-medium tabular-nums ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Return to Public Storefront */}
      <div className="p-4 border-t border-[#2A241F]">
        <button
          onClick={() => navigateTo('home')}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 border border-[#3A352F] hover:border-[#B69A59] text-xs text-[#D6D3D1] hover:text-[#FFFFFF] rounded-xs transition-colors cursor-pointer"
        >
          <ExternalLink size={13} />
          <span>Exit to Storefront</span>
        </button>
      </div>
    </aside>
  );
};
