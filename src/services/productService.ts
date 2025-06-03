import { InMemoryRepository } from "../repositories/inMemoryRepository";
import { Store, Product } from "../types";

export class ProductService {
  constructor(private repo: InMemoryRepository) {}

  /**
   * Returns all Store objects for a given productId (or [] if not found).
   */
  async getStoresForProduct(productId: string): Promise<Store[]> {
    const product: Product | null = await this.repo.findProductById(productId);
    if (!product) {
      return [];
    }

    const storeIds: string[] = await this.repo.getStoreIdsByProduct(productId);

    const result: Store[] = [];
    for (const sid of storeIds) {
      const s = await this.repo.findStoreById(sid);
      if (s) {
        result.push(s);
      }
    }

    return result;
  }
}
