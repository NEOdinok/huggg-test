import Fastify from "fastify";

import { brands, products, stores, productToStoreIds } from "./data";

import { InMemoryRepository } from "./repositories/inMemoryRepository";
import { BrandService } from "./services/brandService";
import { ProductService } from "./services/productService";
import { registerBrandRoutes } from "./routes/brandRoutes";
import { registerProductRoutes } from "./routes/productRoutes";

export async function buildServer() {
  const fastify = Fastify({ logger: true });

  fastify.setErrorHandler((error, request, reply) => {
    if (error.validation) {
      return reply.status(400).send({
        statusCode: 400,
        error: "Bad Request",
        message: "Payload did not pass validation",
        details: error.validation,
      });
    }

    request.log.error(error);

    return reply.status(500).send({
      statusCode: 500,
      error: "Internal Server Error",
      message: "Something went wrong on the server.",
    });
  });

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
