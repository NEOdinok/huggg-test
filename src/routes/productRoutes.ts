import { FastifyPluginAsync } from "fastify";
import { Static } from "@sinclair/typebox";
import { ProductService } from "@/services/productService";
import { getPagination } from "@/utils";
import {
  ErrorResponseSchema,
  PaginationQuerySchema,
  ProductStoresParamsSchema,
  ProductStoresResponseSchema,
} from "@/schemas";

type Params = Static<typeof ProductStoresParamsSchema>;
type Query = Static<typeof PaginationQuerySchema>;

export const productRoutes: FastifyPluginAsync<{
  service: ProductService;
}> = async (fastify, { service }) => {
  fastify.get<{
    Params: Params;
    Querystring: Query;
    Reply: Static<
      typeof ProductStoresResponseSchema | typeof ErrorResponseSchema
    >;
  }>(
    "/products/:productId/stores",
    {
      schema: {
        params: ProductStoresParamsSchema,
        querystring: PaginationQuerySchema,
        response: { 200: ProductStoresResponseSchema },
      },
    },
    async (request, reply) => {
      const { productId } = request.params;
      const { page, per_page: itemsPerPage } = request.query;

      const allStores = await service.getStoresForProduct(productId);
      if (allStores === null) {
        return reply.status(404).send({ message: "Product not found." });
      }

      const totalItems = allStores.length;
      const { pageEnsuredWithinRange, startIndex, endIndex, lastPage } =
        getPagination(totalItems, page, itemsPerPage);

      return reply.send({
        data: allStores.slice(startIndex, endIndex),
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
