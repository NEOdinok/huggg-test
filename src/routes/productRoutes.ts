import { FastifyInstance } from "fastify";
import { ProductService } from "@/services/productService";

import {
  parsePageQueryString,
  parsePerPageQueryString,
  getPagination,
} from "../utils";

/**
 * Hey, tell me where I can redeem a particular product.
 * (Every store that has it)’
 */

interface ProductStoresQuery {
  page?: string;
  per_page?: string;
}

export function registerProductRoutes(
  fastify: FastifyInstance,
  productService: ProductService
) {
  fastify.get<{
    Params: { productId: string };
    Querystring: ProductStoresQuery;
  }>("/products/:productId/stores", async (request, reply) => {
    const { productId } = request.params;

    const page = parsePageQueryString(request.query.page);
    const itemsPerPage = parsePerPageQueryString(request.query.per_page);

    const allStores = await productService.getStoresForProduct(productId);
    if (allStores === null) {
      return reply.status(404).send({ message: "Product not found." });
    }

    const totalItems = allStores.length; // total = 45

    const { pageEnsuredWithinRange, startIndex, endIndex, lastPage } =
      getPagination(totalItems, page, itemsPerPage);

    const pageItems = allStores.slice(startIndex, endIndex);

    return reply.status(200).send({
      data: pageItems,
      meta: {
        totalItems,
        itemsPerPage,
        lastPage,
        page: pageEnsuredWithinRange,
      },
    });
  });
}
