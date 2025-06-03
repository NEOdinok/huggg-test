import { beforeAll, afterAll, describe, it, expect } from "@jest/globals";
import type { FastifyInstance } from "fastify";
import { buildServer } from "../src/server";

let app: FastifyInstance;

beforeAll(async () => {
  app = await buildServer();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("GET /brands/:brandId/products", () => {
  it("returns 200 & list of products (own + consolidated) for an existing brand", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/brands/brand-1/products",
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload) as Array<{ id: string; name: string }>;
    expect(Array.isArray(body)).toBe(true);
    expect(body).toEqual([
      { id: "product-1", name: "Product One" },
      { id: "product-2", name: "Product Two" },
    ]);
  });

  it("returns 404 & error message if brand does not exist (or has no products)", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/brands/nonexistent/products",
    });

    expect(res.statusCode).toBe(404);
    const body = JSON.parse(res.payload);
    expect(body).toEqual({
      message: "Brand not found or no products.",
    });
  });
});
