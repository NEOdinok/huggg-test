import { FastifyInstance } from "fastify";
import { BrandService } from "@/services/brandService";
import {
  getPagination,
  parsePageQueryString,
  parsePerPageQueryString,
} from "../utils";

interface BrandProductsQuery {
  page?: string;
  per_page?: string;
}

/**
 *  Hey, give me a brand’s catalogue.
 *  Paginated if it is too long.
 */

export function registerBrandRoutes(
  fastify: FastifyInstance,
  brandService: BrandService
) {
  fastify.get<{
    Params: { brandId: string };
    Querystring: BrandProductsQuery;
  }>("/brands/:brandId/products", async (request, reply) => {
    const { brandId } = request.params;

    const page = parsePageQueryString(request.query.page);
    const itemsPerPage = parsePerPageQueryString(request.query.per_page);

    // 1) Fetch all products (unpaginated)
    const allProducts = await brandService.getProductsForBrand(brandId);

    if (allProducts === null) {
      return reply.status(404).send({ message: "Brand not found." });
    }

    // 2) Calculate pagination
    const totalItems = allProducts.length;

    const { pageEnsuredWithinRange, startIndex, endIndex, lastPage } =
      getPagination(totalItems, page, itemsPerPage);

    const pageItems = allProducts.slice(startIndex, endIndex);

    // 3) Return a structured response with metadata
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
