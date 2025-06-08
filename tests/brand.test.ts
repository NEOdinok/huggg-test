import Fastify from "fastify";
import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";

import { brandRoutes } from "../src/routes/brandRoutes";
import { InMemoryRepository } from "../src/repositories/inMemoryRepository";
import { BrandService } from "../src/services/brandService";

const mockBrands = [
  {
    id: "brand-A",
    name: "Brand A",
    products: ["prod-1"],
    consolidated_products: ["prod-3"],
    stores: [],
  },
  {
    id: "brand-B",
    name: "Brand B",
    products: ["prod-3", "prod-4"],
    consolidated_products: [],
    stores: [],
  },
  {
    id: "brand-C",
    name: "Brand C (no products)",
    products: [],
    consolidated_products: [],
    stores: [],
  },
] as const;

const mockProducts = [
  {
    id: "prod-1",
    label: "Product 1",
    brand_id: "brand-A",
  },
  {
    id: "prod-3",
    label: "Product 3 (shared)",
    brand_id: "brand-B", // consolidated into A but its home brand is B
  },
  {
    id: "prod-4",
    label: "Product 4",
    brand_id: "brand-B",
  },
] as const;

const mockStores: any[] = [];
const mockProductStores: Record<string, string[]> = {};

describe("GET /brands/:brandId/products", () => {
  let fastify: ReturnType<typeof Fastify>;

  beforeEach(async () => {
    fastify = Fastify();

    const repo = new InMemoryRepository(
      // Cast to mutable because InMemoryRepository mutates nothing but expects arrays
      [...mockBrands] as any,
      [...mockProducts] as any,
      [...mockStores] as any,
      { ...mockProductStores }
    );

    await fastify.register(brandRoutes, {
      service: new BrandService(repo),
    });

    await fastify.ready();
  });

  afterEach(async () => {
    await fastify.close();
  });

  it("returns 200 & paginated list of products (own + consolidated) for an existing brand", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/brands/brand-A/products?page=1&per_page=10",
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.map((p: any) => p.id).sort()).toEqual([
      "prod-1",
      "prod-3",
    ]);
    expect(body.meta).toMatchObject({
      totalItems: 2,
      itemsPerPage: 10,
      page: 1,
      lastPage: 1,
    });
  });

  it("returns 404 & error message if brand does not exist", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/brands/not-a-real-id/products",
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({ message: "Brand not found." });
  });

  it("returns 200 & empty data if brand exists but has no products", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/brands/brand-C/products?page=1&per_page=5",
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();
    expect(body.data).toEqual([]);
    expect(body.meta).toMatchObject({
      totalItems: 0,
      itemsPerPage: 5,
      page: 1,
      lastPage: 1,
    });
  });

  it("invalid route params test", async () => {
    const res = await fastify.inject({
      method: "GET",
      url: "/brands/brand-A/products?per_page=-5&page=abc",
    });

    expect(res.statusCode).toBe(400);
  });
});
