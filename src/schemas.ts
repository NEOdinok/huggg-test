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
    id: Type.String(),
    name: Type.String(),
    brand_id: Type.String(),
  },
  { additionalProperties: true }
);

export const PaginationQuerySchema = Type.Object({
  page: Type.Number({ minimum: 1, default: 1 }),
  per_page: Type.Number({ minimum: 1, maximum: 100, default: 20 }),
});

export const ErrorResponseSchema = Type.Object({
  message: Type.String(),
});

export const BrandProductsParamsSchema = Type.Object({
  brandId: Type.String(),
});

export const ProductStoresParamsSchema = Type.Object({
  productId: Type.String(),
});

export const BrandProductsResponseSchema = Type.Object({
  data: Type.Array(ProductSchema),
  meta: Type.Object({
    totalItems: Type.Number(),
    itemsPerPage: Type.Number(),
    lastPage: Type.Number(),
    page: Type.Number(),
  }),
});

export const ProductStoresResponseSchema = Type.Object({
  data: Type.Array(StoreSchema),
  meta: Type.Object({
    totalItems: Type.Number(),
    itemsPerPage: Type.Number(),
    lastPage: Type.Number(),
    page: Type.Number(),
  }),
});
