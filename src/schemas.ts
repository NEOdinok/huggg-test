import { Type } from "@sinclair/typebox";

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

export const ProductSchema = Type.Object(
  {
    id: Type.String(),
    label: Type.String(),
    brand_id: Type.String(),
  },
  { additionalProperties: true }
);

export const StoreSchema = Type.Object(
  {
    id: Type.String(), // drop format: "uuid"
    name: Type.String(),
    brand_id: Type.String(),
  },
  { additionalProperties: true }
);
