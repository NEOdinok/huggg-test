/**
 * Import the raw JSON
 * Validate everything against typebox schema
 * Populate and export maps
 */

import raw from "../brands.json";
import { BrandSchema, ProductSchema, StoreSchema } from "./schemas";
import { Static, Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

// Tell TypeBox what a “validated Brand” looks like in TS:
export type Brand = Static<typeof BrandSchema>;
export type Product = Static<typeof ProductSchema>;
export type Store = Static<typeof StoreSchema>;

// (1) Extract the array of Brand-shaped objects from brands.json.
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

// (2) Build a TypeBox “Array” schema for each and validate:
const BrandListSchema = Type.Array(BrandSchema);
const ProductListSchema = Type.Array(ProductSchema);
const StoreListSchema = Type.Array(StoreSchema);

// (3) At startup, compile and assert:
const brandCompiler = TypeCompiler.Compile(BrandListSchema);
const productCompiler = TypeCompiler.Compile(ProductListSchema);
const storeCompiler = TypeCompiler.Compile(StoreListSchema);

if (!brandCompiler.Check(pages)) {
  console.error("brands.json → `data` array did not match BrandSchema");

  const pages = raw.data as unknown as unknown[]; // the array from brands.json
  const brandCompiler = TypeCompiler.Compile(Type.Array(BrandSchema));

  // LOOP
  // If the entire array fails, dig into each element to see which one is bad:
  // console.error(
  //   "❌ brands.json → the array itself failed validation. Let’s find out why…\n"
  // );

  // for (let i = 0; i < pages.length; i++) {
  //   const single = pages[i];
  //   // Check each object one at a time:
  //   if (!TypeCompiler.Compile(BrandSchema).Check(single)) {
  //     console.error(
  //       `⚠️ Item at index ${i} failed BrandSchema:\n`,
  //       single,
  //       "\n"
  //     );
  //     // Now show the exact TypeBox errors for that object:
  //     const errors = Array.from(
  //       TypeCompiler.Compile(BrandSchema).Errors(single)
  //     );
  //     console.error("Validation errors:\n", JSON.stringify(errors, null, 2));
  //     break; // stop after the first failure
  //   }
  // }

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

// (4) Since we now know the shapes are correct, cast them to their static types:
export const brands: Brand[] = pages as Brand[];
export const products: Product[] = embeddedProducts as Product[];
export const stores: Store[] = embeddedStores as Store[];

// (5) Build a helper map from productId → storeIds.
//     The `embedded.products` entries know nothing about stores directly;
//     you need to walk through every Brand object’s `stores` list
//     and cross‐reference which products belong to which brand → store.
//     For simplicity, let’s do a two‐pass: build a store→brand lookup,
//     then for each brand, for each store ID, assign every productId under that brand.

// First, make a `brandMap` so we can look up a Brand quickly:
const brandMap = new Map<string, Brand>();

for (const brand of brands) {
  brandMap.set(brand.id, brand);
}

// Next, for each product, figure out which brand(s) it belongs to:
// Actually, embeddedProducts[].brand_id is its “true” parent brand,
// but if it shows up in any brand’s `consolidated_products`, it “belongs” there too.
// (We’ll deal with that in getProductsForBrand in the service layer.)

// Build a helper map
// productId → storeId[]
const productStores: Record<string, string[]> = {};
// Initialize every productId with an empty array
for (const product of products) {
  productStores[product.id] = [];
}

// Now for each Brand B, for each storeId in B.stores,
// attach those storeIds to each product in B.products + B.consolidated_products.
for (const brand of brands) {
  const allProductIds = [...brand.products, ...brand.consolidated_products];
  for (const pid of allProductIds) {
    // If the productId doesn’t exist in our productStores map, skip (maybe malformed)
    if (!(pid in productStores)) continue;

    // Attach EVERY store of this brand to that product
    for (const sid of brand.stores) {
      if (!productStores[pid].includes(sid)) {
        productStores[pid].push(sid);
      }
    }
  }
}

export const productToStoreIds = productStores;
