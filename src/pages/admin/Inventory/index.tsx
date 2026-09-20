import React, { useState, useMemo } from "react";
import type { Product } from "../../../types";
import { Button } from "../../../components/Button";
import { SearchInput } from "../../../components/ui/SearchInput";
import { ListRowSkeleton } from "../../../components/ui/Skeleton";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { PlusCircle } from "lucide-react";
import { DesktopTable } from "./DesktopTable";
import { MobileCardList } from "./MobileCardList";

export interface InventoryProps {
  products: Product[];
  isLoadingProducts?: boolean;
  onAddProduct: () => void;
  onEditProduct: (productId: string) => void;
  onRemoveProduct: (productId: string) => void;
  onQuickSale: (productId: string) => void;
  onQuickRestock: (productId: string) => void;
}

export const Inventory: React.FC<InventoryProps> = ({
  products,
  isLoadingProducts = false,
  onAddProduct,
  onEditProduct,
  onRemoveProduct,
  onQuickSale,
  onQuickRestock,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, searchQuery]);

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-light text-black dark:text-white font-brand-serif">
            Perfume Inventory
          </h2>
          <p className="text-xs uppercase tracking-widest text-black/45 dark:text-white/45 mt-1">
            {products.length} Products Catalogued
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onAddProduct}
          className="flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add Perfume</span>
        </Button>
      </div>

      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Filter inventory by name..."
        ariaLabel="Filter inventory"
        className="w-full max-w-md"
      />

      {isLoadingProducts ? (
        <div className="space-y-3">
          <ListRowSkeleton lines={2} />
          <ListRowSkeleton lines={2} />
          <ListRowSkeleton lines={2} />
          <ListRowSkeleton lines={2} />
          <ListRowSkeleton lines={2} />
        </div>
      ) : (
        <>
          {filteredProducts.length === 0 && (
            <div className="relative overflow-hidden rounded-xl surface-glass-strong p-6 text-center py-16 shadow-[0_0_0_1px_rgba(212,175,55,0.1),0_12px_40px_-10px_rgba(0,0,0,0.15)]">
              <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true" />
              <p className="relative text-sm text-black/45 dark:text-white/45 mb-4">
                {searchQuery
                  ? `No perfumes matching "${searchQuery}".`
                  : "No perfumes in the inventory catalog yet."}
              </p>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={onAddProduct}
              >
                + Add First Perfume
              </Button>
            </div>
          )}

          <DesktopTable
            products={filteredProducts}
            onQuickSale={onQuickSale}
            onQuickRestock={onQuickRestock}
            onEditProduct={onEditProduct}
            onRemoveProduct={(id) => {
              const target = filteredProducts.find((p) => p.id === id);
              if (target) setPendingDelete(target);
            }}
          />

          <MobileCardList
            products={filteredProducts}
            onQuickSale={onQuickSale}
            onQuickRestock={onQuickRestock}
            onEditProduct={onEditProduct}
            onRemoveProduct={(id) => {
              const target = filteredProducts.find((p) => p.id === id);
              if (target) setPendingDelete(target);
            }}
          />
        </>
      )}

      <ConfirmDialog
        isOpen={pendingDelete !== null}
        title="Remove this perfume?"
        message={
          <>
            <span className="font-semibold text-black dark:text-white">
              {pendingDelete?.name}
            </span>{" "}
            will be removed from the inventory catalog. This cannot be undone.
          </>
        }
        confirmLabel="Remove Perfume"
        confirmVariant="danger"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) onRemoveProduct(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
};