import { LOW_STOCK_THRESHOLD } from "../../../constants";

export type StockStatusKind = "out" | "low" | "in";

export const getStockStatus = (stock: number): StockStatusKind => {
  if (stock <= 0) return "out";
  if (stock <= LOW_STOCK_THRESHOLD) return "low";
  return "in";
};

export const statusBadgeClass = (kind: StockStatusKind): string => {
  switch (kind) {
    case "out":
      return "bg-red-950 text-red-300 border border-red-800";
    case "low":
    case "in":
      return "bg-gold/10 text-gold border border-gold/40";
  }
};

export function statusLabel(kind: StockStatusKind, stock: number): string {
  switch (kind) {
    case "out":
      return "Out of Stock";
    case "low":
      return `Low Stock (${stock})`;
    case "in":
      return "In Stock";
  }
}