import { Brand, Product } from "./types";

// ─── BRANDS ────────────────────────────────────────────────────────────────
// We define two brands with overlapping “consolidated” IDs:
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

// ─── PRODUCTS ───────────────────────────────────────────────────────────────
export const products: Product[] = [
  { id: "product-1", name: "Product One" },
  { id: "product-2", name: "Product Two" },
  { id: "product-3", name: "Product Three" },
];
