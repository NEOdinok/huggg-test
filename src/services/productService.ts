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

  async getStoresForProduct(productId: string): Promise<Store[] | null> {
    const product = await this.repo.findProductById(productId);
    if (!product) return null;

    const storeIds = await this.repo.getStoreIdsByProduct(productId);
    const stores: Store[] = [];
    for (const storeId of storeIds) {
      const store = await this.repo.findStoreById(storeId);
      if (store) stores.push(store);
    }
    return stores;
  }
}
