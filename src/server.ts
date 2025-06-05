import Fastify from "fastify";

import { brands, products, stores, productToStoreIds } from "./data";

import { InMemoryRepository } from "./repositories/inMemoryRepository";
import { BrandService } from "./services/brandService";
import { ProductService } from "./services/productService";
import { registerBrandRoutes } from "./routes/brandRoutes";
import { registerProductRoutes } from "./routes/productRoutes";

export async function buildServer() {
  const fastify = Fastify({ logger: true });

  // Pass the validated, in‐memory arrays/maps to your repository:
  const repo = new InMemoryRepository(
    brands,
    products,
    stores,
    productToStoreIds
  );

  const brandService = new BrandService(repo);
  registerBrandRoutes(fastify, brandService);

  const productService = new ProductService(repo);
  registerProductRoutes(fastify, productService);

  return fastify;
}

if (require.main === module) {
  (async () => {
    const app = await buildServer();
    await app.listen({ port: 3000 });
    console.log(" 👀👂 on http://localhost:3000");
  })();
}
