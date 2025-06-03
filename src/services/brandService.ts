import { Brand, Product } from "../types";
import { InMemoryRepository } from "../repositories/inMemoryRepository";

export class BrandService {
  constructor(private repo: InMemoryRepository) {}

  /**
   * Returns all Product objects (own + consolidated) for a given brandId.
   * If the brand does not exist, return an empty array.
   */

  async getProductsForBrand(brandId: string): Promise<Product[]> {
    const brand: Brand | null = await this.repo.findBrandById(brandId);

    if (!brand) {
      return [];
    }

    const allIds = [...brand.products, ...brand.consolidated_products];
    const result: Product[] = [];

    for (const pid of allIds) {
      const p = await this.repo.findProductById(pid);
      if (p) {
        result.push(p);
      }
    }

    return result;
  }
}
