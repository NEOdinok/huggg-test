import { Type } from "@sinclair/typebox";

/**
 * Each “Brand” record in brands.json (the fields we actually need).
 * We only use: id, name, products, consolidated_products, stores.
 */
export const BrandSchema = Type.Object(
  {
    id: Type.String(),
    name: Type.String(),
    products: Type.Array(Type.String()),
    consolidated_products: Type.Array(Type.String()),
    stores: Type.Array(Type.String()),
  },
  { additionalProperties: true }
);
/**
 * Each “Product” object is nested under raw.embedded.products.
 * We only need: id, label, brand_id.  (You can add more fields if you need them later.)
 */
export const ProductSchema = Type.Object(
  {
    id: Type.String(),
    label: Type.String(),
    brand_id: Type.String(),
  },
  { additionalProperties: true }
);

/**
 * Each “Store” object is nested under raw.embedded.stores.
 * We only need: id, name, brand_id.  (Again, feel free to add address/latitude if you plan to use it later.)
 */
export const StoreSchema = Type.Object(
  {
    id: Type.String(), // drop format: "uuid"
    name: Type.String(),
    brand_id: Type.String(),
  },
  { additionalProperties: true }
);
