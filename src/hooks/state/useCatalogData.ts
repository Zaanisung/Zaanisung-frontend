import { useState, useEffect, useCallback } from "react";
import type { Product } from "../../types";
import * as api from "../../services";
import { getErrorMessage } from "../../services";

/**
 * Catalog slice: the (public) product list and its fetch lifecycle.
 * Consumed by useAppState so pages that only need product data never trigger
 * the rest of the app state to re-render.
 */
export function useCatalogData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    setProductsError(null);
    try {
      const { products: apiProducts } = await api.getProducts();
      const mapped: Product[] = apiProducts.map((p) => ({
        _id: p._id,
        id: p._id,
        name: p.name,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl || "",
        stock: p.stock,
        isActive: p.isActive,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }));
      setProducts(mapped);
    } catch (err) {
      setProductsError(getErrorMessage(err, "Failed to load products"));
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    setProducts,
    isLoadingProducts,
    productsError,
    fetchProducts,
  };
}