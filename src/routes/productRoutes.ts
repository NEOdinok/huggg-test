import { FastifyInstance } from "fastify";
import { ProductService } from "../services/productService";

export function registerProductRoutes(
  fastify: FastifyInstance,
  productService: ProductService
) {
  fastify.get<{ Params: { productId: string } }>(
    "/products/:productId/stores",
    async (request, reply) => {
      const { productId } = request.params;

      const stores = await productService.getStoresForProduct(productId);

      if (stores.length === 0) {
        return reply
          .status(404)
          .send({ message: "Product not found or no stores." });
      }

      return reply.status(200).send(stores);
    }
  );
}
