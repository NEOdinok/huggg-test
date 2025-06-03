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

describe("GET /products/:productId/stores", () => {
  it("returns 200 & list of stores for an existing product", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/products/product-1/stores",
    });
    expect(res.statusCode).toBe(200);

    const body = JSON.parse(res.payload) as Array<{ id: string; name: string }>;
    expect(Array.isArray(body)).toBe(true);
    expect(body).toEqual([
      { id: "store-1", name: "Store One" },
      { id: "store-2", name: "Store Two" },
    ]);
  });

  it("returns 404 & error if the product does not exist (or no stores)", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/products/nonexistent/stores",
    });
    expect(res.statusCode).toBe(404);
    const body = JSON.parse(res.payload);
    expect(body).toEqual({
      message: "Product not found or no stores.",
    });
  });
});
