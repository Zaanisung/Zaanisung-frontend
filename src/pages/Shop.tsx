import React from "react";
import { Product } from "../types";
import { ProductGrid } from "../components/ProductGrid";

export interface ShopProps {
  products: Product[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  recentlyAddedId?: string | null;
}

export const Shop: React.FC<ShopProps> = ({
  products,
  isLoading,
  error,
  onRetry,
  onSelectProduct,
  onAddToCart,
  recentlyAddedId,
}) => {
  return (
    <div className="w-full">
      <ProductGrid
        products={products}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        onSelectProduct={onSelectProduct}
        onAddToCart={onAddToCart}
        recentlyAddedId={recentlyAddedId}
      />
    </div>
  );
};
