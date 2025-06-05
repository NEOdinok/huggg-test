import { Brand, Product } from "../data";
import { InMemoryRepository } from "../repositories/inMemoryRepository";

export class BrandService {
  constructor(private repo: InMemoryRepository) {}

  /**
   * Returns all Product objects (own + consolidated) for a given brandId.
   * If the brand does not exist, return an empty array.
   */

  // old one
  // async getProductsForBrand(brandId: string): Promise<Product[]> {
  //   const brand: Brand | null = await this.repo.findBrandById(brandId);

  //   if (!brand) {
  //     return [];
  //   }

  //   const allIds = [...brand.products, ...brand.consolidated_products];
  //   const result: Product[] = [];

  //   for (const pid of allIds) {
  //     const p = await this.repo.findProductById(pid);
  //     if (p) {
  //       result.push(p);
  //     }
  //   }

  //   return result;
  // }

  async getProductsForBrand(brandId: string): Promise<Product[]> {
    const brand = await this.repo.findBrandById(brandId);
    if (!brand) return [];

    // Combine “own” products + any consolidated products:
    const allProductIds = [...brand.products, ...brand.consolidated_products];

    // Look up each product object by ID:
    const results: Product[] = [];
    for (const productId of allProductIds) {
      const product = await this.repo.findProductById(productId);
      if (product) results.push(product);
    }
    return results;
  }
}
