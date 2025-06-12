import raw from "../brands.json";
import { BrandSchema, ProductSchema, StoreSchema } from "./schemas";
import { Static, Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

export type Brand = Static<typeof BrandSchema>;
export type Product = Static<typeof ProductSchema>;
export type Store = Static<typeof StoreSchema>;

// brands.json structure:
// {
//   "data": [
//     {
//       "id": "...",
//       "name": "...",
//       "products": [ ... ],
//       "consolidated_products": [ ... ],
//       "stores": [ ... ]
//     },
//     ...
//   ],
//   "embedded": {
//     "products": [ ... ],
//     "stores": [ ... ]
//   },
//   ...
// }
const pages = raw.data as unknown;
const embeddedProducts = (raw.embedded?.products ?? []) as unknown;
const embeddedStores = (raw.embedded?.stores ?? []) as unknown;

const BrandListSchema = Type.Array(BrandSchema);
const ProductListSchema = Type.Array(ProductSchema);
const StoreListSchema = Type.Array(StoreSchema);

const brandCompiler = TypeCompiler.Compile(BrandListSchema);
const productCompiler = TypeCompiler.Compile(ProductListSchema);
const storeCompiler = TypeCompiler.Compile(StoreListSchema);

if (!brandCompiler.Check(pages)) {
  console.error("brands.json → `data` array did not match BrandSchema");

  process.exit(1);
}

if (!productCompiler.Check(embeddedProducts)) {
  console.error(
    "brands.json → `embedded.products` did not match ProductSchema[]"
  );
  process.exit(1);
}

if (!storeCompiler.Check(embeddedStores)) {
  console.error("brands.json → `embedded.stores` did not match StoreSchema[]");
  process.exit(1);
}

export const brands: Brand[] = pages as Brand[];
export const products: Product[] = embeddedProducts as Product[];
export const stores: Store[] = embeddedStores as Store[];

const brandMap = new Map<string, Brand>();

for (const brand of brands) {
  brandMap.set(brand.id, brand);
}

// 1. prerequisites that we'll be working with
const productStores: Record<string, string[]> = {};
for (const product of products) {
  productStores[product.id] = [];
}

// 2. go brand by brand and for each brand:
for (const brand of brands) {
  // 3. Take all products this brand sells (own and consolidated) and for each product:
  const allProductIds = [...brand.products, ...brand.consolidated_products];
  for (const pid of allProductIds) {
    if (!(pid in productStores)) continue;

    // 4. Based on the fact that brand sells each one of those products
    // attach all brand's stores to this product.
    // We need loop to avoid duplicates
    for (const sid of brand.stores) {
      if (!productStores[pid].includes(sid)) {
        productStores[pid].push(sid);
      }
    }
  }
}

export const productToStoreIds = productStores;
