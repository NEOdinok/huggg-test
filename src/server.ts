import Fastify from "fastify";
import { brands, products } from "./data";
import { InMemoryRepository } from "./repositories/inMemoryRepository";
import { BrandService } from "./services/brandService";
import { registerBrandRoutes } from "./routes/brandRoutes";

export async function buildServer() {
  const fastify = Fastify();

  const repo = new InMemoryRepository(brands, products);

  const brandService = new BrandService(repo);

  registerBrandRoutes(fastify, brandService);

  return fastify;
}

if (require.main === module) {
  (async () => {
    const app = await buildServer();
    await app.listen({ port: 3000 });
    console.log("Server listening on http://localhost:3000");
  })();
}
