/**
 * Inventory and catalog filtering utilities
 */

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) return 'out_of_stock';
  if (stock <= 5) return 'low_stock';
  return 'in_stock';
}

export function getStockStatusLabel(status: StockStatus): string {
  switch (status) {
    case 'in_stock':
      return 'In Stock';
    case 'low_stock':
      return 'Low Stock';
    case 'out_of_stock':
      return 'Out of Stock';
  }
}

export interface FilterableProduct {
  id: string;
  name: string;
  brand: string;
  family: string;
  price: number;
  stock: number;
  notes?: {
    top?: string[];
    heart?: string[];
    base?: string[];
  };
}

export interface ProductFilters {
  searchQuery?: string;
  family?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  onlyInStock?: boolean;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'name-asc';
}

export function filterProducts<T extends FilterableProduct>(
  products: T[],
  filters: ProductFilters
): T[] {
  let result = [...products];

  // Search
  if (filters.searchQuery && filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase().trim();
    result = result.filter((p) => {
      const matchName = p.name.toLowerCase().includes(query);
      const matchBrand = p.brand.toLowerCase().includes(query);
      const matchFamily = p.family.toLowerCase().includes(query);
      const allNotes = [
        ...(p.notes?.top || []),
        ...(p.notes?.heart || []),
        ...(p.notes?.base || []),
      ].join(' ').toLowerCase();
      const matchNotes = allNotes.includes(query);
      return matchName || matchBrand || matchFamily || matchNotes;
    });
  }

  // Family
  if (filters.family && filters.family !== 'All') {
    result = result.filter((p) => p.family.toLowerCase() === filters.family!.toLowerCase());
  }

  // Brand
  if (filters.brand && filters.brand !== 'All') {
    result = result.filter((p) => p.brand.toLowerCase() === filters.brand!.toLowerCase());
  }

  // Min Price
  if (typeof filters.minPrice === 'number' && filters.minPrice > 0) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }

  // Max Price
  if (typeof filters.maxPrice === 'number' && filters.maxPrice > 0) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }

  // In Stock Only
  if (filters.onlyInStock) {
    result = result.filter((p) => p.stock > 0);
  }

  // Sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        // Keep order as-is
        break;
    }
  }

  return result;
}
