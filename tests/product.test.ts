import Fastify from "fastify";
import { describe, beforeEach, afterEach, it, expect } from "@jest/globals";

import { productRoutes } from "../src/routes/productRoutes";
import { InMemoryRepository } from "../src/repositories/inMemoryRepository";
import { ProductService } from "../src/services/productService";

const mockBrands: any[] = []; // ProductService doesn’t touch brands.

const mockProducts = [
  {
    id: "product-1",
    label: "Product One",
    brand_id: "brand-X",
  },
  {
    id: "product-2", // Exists but has no stores mapped below.
    label: "Product Two (no stores)",
    brand_id: "brand-Y",
  },
] as const;

const mockStores = [
  {
    id: "store-1",
    name: "Store One",
    brand_id: "brand-X",
  },
  {
    id: "store-2",
    name: "Store Two",
    brand_id: "brand-X",
  },
] as const;

// Mapping product → array of storeIds
const mockProductStores: Record<string, string[]> = {
  "product-1": ["store-1", "store-2"],
  // product‑2 intentionally omitted -> []
};

describe("GET /products/:productId/stores", () => {
  let fastify: ReturnType<typeof Fastify>;

  beforeEach(async () => {
    fastify = Fastify();

    const repo = new InMemoryRepository(
      [...mockBrands],
      [...mockProducts] as any,
      [...mockStores] as any,
      { ...mockProductStores }
    );

    await fastify.register(productRoutes, {
      service: new ProductService(repo),
    });

    await fastify.ready();
  });

  afterEach(async () => {
    await fastify.close();
  });

  it("returns 200 & paginated list of stores for an existing product", async () => {
    const res = await fastify.inject({
      method: "GET",
      url: "/products/product-1/stores?page=1&per_page=10",
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();

    expect(body.data).toEqual(
      expect.arrayContaining([
        { id: "store-1", name: "Store One", brand_id: "brand-X" },
        { id: "store-2", name: "Store Two", brand_id: "brand-X" },
      ])
    );

    expect(body.meta).toMatchObject({
      totalItems: 2,
      itemsPerPage: 10,
      page: 1,
      lastPage: 1,
    });
  });

  it("returns 404 & error message if product does not exist", async () => {
    const res = await fastify.inject({
      method: "GET",
      url: "/products/nonexistent/stores",
    });

    expect(res.statusCode).toBe(404);
    expect(res.json()).toEqual({ message: "Product not found." });
  });

  it("returns 200 & empty data if product exists but has no stores", async () => {
    const res = await fastify.inject({
      method: "GET",
      url: "/products/product-2/stores?page=1&per_page=5",
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();

    expect(body.data).toEqual([]);
    expect(body.meta).toMatchObject({
      totalItems: 0,
      itemsPerPage: 5,
      page: 1,
      lastPage: 1,
    });
  });
});
