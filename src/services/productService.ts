import { InMemoryRepository } from "../repositories/inMemoryRepository";
import { Store, Product } from "../data";

export class ProductService {
  constructor(private repo: InMemoryRepository) {}

  /**
   * Returns all Stores for a given productId (or [] if not found).
   *
   * Plain english:
   *
   * Take product X,
   * look up every brand that offers it (native or consolidated),
   * gather all of those brands’ stores,
   * hand back all of those store records.
   */

  async getStoresForProduct(productId: string): Promise<Store[]> {
    // Find which store‐IDs serve this product:
    const storeIds = await this.repo.getStoreIdsByProduct(productId);
    if (storeIds.length === 0) return [];

    // Map each storeId → Store object
    const out: Store[] = [];
    for (const storeId of storeIds) {
      const store = await this.repo.findStoreById(storeId);
      if (store) out.push(store);
    }
    return out;
  }
}
