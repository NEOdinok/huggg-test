import { Brand, Product, Store } from "./types";

export const brands: Brand[] = [
  {
    id: "brand-1",
    name: "Brand One",
    products: ["product-1"],
    consolidated_products: ["product-2"],
  },
  {
    id: "brand-2",
    name: "Brand Two",
    products: ["product-3"],
    consolidated_products: [],
  },
];

export const products: Product[] = [
  { id: "product-1", name: "Product One" },
  { id: "product-2", name: "Product Two" },
  { id: "product-3", name: "Product Three" },
];

export const stores: Store[] = [
  { id: "store-1", name: "Store One" },
  { id: "store-2", name: "Store Two" },
  { id: "store-3", name: "Store Three" },
];

export const productStores: Record<string, string[]> = {
  "product-1": ["store-1", "store-2"],
  "product-2": ["store-2"], // might also appear under multiple brand→product combos
  "product-3": ["store-3"],
};
