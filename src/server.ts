import dotenv from "dotenv";
dotenv.config();

import "tsconfig-paths/register";
import Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { brands, products, stores, productToStoreIds } from "./data";
import { InMemoryRepository } from "./repositories/inMemoryRepository";
import { BrandService } from "./services/brandService";
import { ProductService } from "./services/productService";
import { brandRoutes } from "./routes/brandRoutes";
import { productRoutes } from "./routes/productRoutes";

export async function buildServer() {
  const fastify = Fastify({
    logger: true,
    ajv: { customOptions: { coerceTypes: true, useDefaults: true } },
  }).withTypeProvider<TypeBoxTypeProvider>();

  fastify.setErrorHandler((error, request, reply) => {
    if ((error as any).validation) {
      return reply.status(400).send({
        statusCode: 400,
        error: "Bad Request",
        message: "Payload did not pass validation",
        details: (error as any).validation,
      });
    }
    request.log.error(error);
    return reply.status(500).send({
      statusCode: 500,
      error: "Internal Server Error",
      message: "Something went wrong on the server.",
    });
  });

  const repo = new InMemoryRepository(
    brands,
    products,
    stores,
    productToStoreIds
  );

  await fastify.register(brandRoutes, {
    service: new BrandService(repo),
  });

  await fastify.register(productRoutes, {
    service: new ProductService(repo),
  });

  return fastify;
}
if (require.main === module) {
  (async () => {
    const app = await buildServer();
    const port = Number(process.env.PORT) || 3000;

    await app.listen({ port });
    console.log(`👀👂 on http://localhost:${port}`);
  })();
}
