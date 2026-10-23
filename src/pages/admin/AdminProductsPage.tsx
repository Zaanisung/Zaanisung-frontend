import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { formatGHS } from '../../utils/currency';
import { getStockStatus } from '../../utils/inventory';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { getProductPlaceholderSvg } from '../../config/assets';

export const AdminProductsPage: React.FC = () => {
  const { products, deleteProduct, navigateTo } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('All');
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFamily = selectedFamily === 'All' || p.family === selectedFamily;
    return matchSearch && matchFamily;
  });

  return (
    <div className="flex-1 min-h-screen bg-[#FAF8F4] flex flex-col text-left">
      <AdminHeader
        title="Perfume Flacon Inventory"
        subtitle={`Managing ${products.length} registered creations in Accra stock`}
        action={
          <Button
            variant="gold"
            size="sm"
            onClick={() => navigateTo('admin-product-new')}
            leftIcon={<Plus size={14} />}
          >
            Create Formulation
          </Button>
        }
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
        {/* Filters and Search Bar */}
        <div className="bg-[#FFFFFF] border border-[#E4DED3] p-4 rounded-xs shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search flacons by name or description..."
              className="w-full bg-[#FAF8F4] text-[#171512] pl-9 pr-4 py-2 text-xs border border-[#E4DED3] rounded-xs focus:border-[#171512] outline-none"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#716C64]" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#716C64]">Family:</span>
            <select
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="bg-[#FAF8F4] text-xs border border-[#E4DED3] rounded-xs px-3 py-2 outline-none cursor-pointer"
            >
              <option value="All">All Families</option>
              <option value="Woody & Oriental">Woody & Oriental</option>
              <option value="Amber & Warm">Amber & Warm</option>
              <option value="Fresh & Citrus">Fresh & Citrus</option>
              <option value="Floral & Delicate">Floral & Delicate</option>
              <option value="Gourmand & Spice">Gourmand & Spice</option>
            </select>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-[#FFFFFF] border border-[#E4DED3] rounded-xs shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F4] text-[#716C64] uppercase tracking-wider text-[11px] border-b border-[#E4DED3]">
                <tr>
                  <th className="px-5 py-3.5">Flacon</th>
                  <th className="px-5 py-3.5">Family & Concentration</th>
                  <th className="px-5 py-3.5">Base Price</th>
                  <th className="px-5 py-3.5">Total Stock</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4DED3]">
                {filtered.map((product) => {
                  const fallback = getProductPlaceholderSvg(product.name, product.family);
                  const status = getStockStatus(product.stock);

                  return (
                    <tr key={product.id} className="hover:bg-[#FAF8F4]/80 transition-colors">
                      <td className="px-5 py-3.5 flex items-center gap-3">
                        <img
                          src={product.image || fallback}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = fallback;
                          }}
                          className="w-10 h-12 object-cover bg-[#F0ECE5] rounded-xs border border-[#E4DED3] shrink-0"
                        />
                        <div>
                          <div className="font-serif text-sm font-semibold text-[#171512]">
                            {product.name}
                          </div>
                          <div className="text-[11px] text-[#716C64] line-clamp-1 max-w-xs">
                            {product.subtitle}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[#171512]">
                        <div>{product.family}</div>
                        <div className="text-[11px] text-[#716C64]">{product.concentration}</div>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-[#171512] tabular-nums">
                        {formatGHS(product.price)}
                      </td>
                      <td className="px-5 py-3.5 font-bold tabular-nums text-[#171512]">
                        {product.stock} units
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={status} type="stock" />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigateTo('admin-product-edit', { productId: product.id })}
                            title="Edit product formulation"
                            className="p-1.5 text-[#716C64] hover:text-[#171512] hover:bg-[#F0ECE5] rounded-xs transition-colors cursor-pointer"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setProductToDelete(product.id)}
                            title="Archive product"
                            className="p-1.5 text-[#716C64] hover:text-red-800 hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirm Delete Product Dialog */}
      <ConfirmDialog
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={() => {
          if (productToDelete) {
            deleteProduct(productToDelete);
            setProductToDelete(null);
          }
        }}
        title="Archive Perfume Formulation"
        message="Are you sure you want to remove this flacon from the active boutique catalog? It will no longer be available for client purchase."
        confirmLabel="Archive Flacon"
        isDestructive
      />
    </div>
  );
};
