import { InMemoryRepository } from "@/repositories/inMemoryRepository";
import { Store, Product } from "@/data";

export class ProductService {
  constructor(private repo: InMemoryRepository) {}

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
