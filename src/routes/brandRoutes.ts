import { FastifyPluginAsync } from "fastify";
import { Static } from "@sinclair/typebox";
import { BrandService } from "@/services/brandService";
import { getPagination } from "@/utils";
import {
  BrandProductsParamsSchema,
  PaginationQuerySchema,
  BrandProductsResponseSchema,
  ErrorResponseSchema,
} from "../schemas";

type Params = Static<typeof BrandProductsParamsSchema>;
type Query = Static<typeof PaginationQuerySchema>;

export const brandRoutes: FastifyPluginAsync<{
  service: BrandService;
}> = async (fastify, { service }) => {
  fastify.get<{
    Params: Params;
    Querystring: Query;
    Reply: Static<
      typeof BrandProductsResponseSchema | typeof ErrorResponseSchema
    >;
  }>(
    "/brands/:brandId/products",
    {
      schema: {
        params: BrandProductsParamsSchema,
        querystring: PaginationQuerySchema,
        response: { 200: BrandProductsResponseSchema },
      },
    },
    async (request, reply) => {
      const { brandId } = request.params;
      const { page, per_page: itemsPerPage } = request.query;

      const allProducts = await service.getProductsForBrand(brandId);
      if (allProducts === null)
        return reply.status(404).send({ message: "Brand not found." });

      const totalItems = allProducts.length;

      const { pageEnsuredWithinRange, startIndex, endIndex, lastPage } =
        getPagination(totalItems, page, itemsPerPage);

      return reply.send({
        data: allProducts.slice(startIndex, endIndex),
        meta: {
          totalItems,
          itemsPerPage,
          lastPage,
          page: pageEnsuredWithinRange,
        },
      });
    }
  );
};
