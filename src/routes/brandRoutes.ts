import { FastifyInstance } from "fastify";
import { BrandService } from "../services/brandService";

/**
 *  Hey, give me a brand’s catalogue
 */
export function registerBrandRoutes(
  fastify: FastifyInstance,
  brandService: BrandService
) {
  fastify.get<{ Params: { brandId: string } }>(
    "/brands/:brandId/products",
    async (request, reply) => {
      const { brandId } = request.params;
      const products = await brandService.getProductsForBrand(brandId);

      if (products === null) {
        return reply.status(404).send({ message: "Brand not found." });
      }

      return reply.status(200).send(products);
    }
  );
}
