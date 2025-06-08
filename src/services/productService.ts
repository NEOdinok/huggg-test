import { InMemoryRepository } from "@/repositories/inMemoryRepository";
import { Store } from "@/data";

export class ProductService {
  constructor(private repo: InMemoryRepository) {}

  async getStoresForProduct(productId: string): Promise<Store[] | null> {
    const product = await this.repo.findProductById(productId);
    if (!product) return null;

    const storeIds = await this.repo.getStoreIdsByProduct(productId);

    const storePromises = storeIds.map((id) => this.repo.findStoreById(id));
    const storeResults = await Promise.all(storePromises); // might change to Promise.allSettled based on business needs

    return storeResults.filter((store): store is Store => !!store);
  }
}
