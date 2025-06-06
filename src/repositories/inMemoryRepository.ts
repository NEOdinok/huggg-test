import { Brand, Product, Store } from "../data";

export class InMemoryRepository {
  private brandMap: Map<string, Brand>;
  private productMap: Map<string, Product>;
  private storeMap: Map<string, Store>;
  private productStores: Record<string, string[]>;

  constructor(
    brands: Brand[],
    products: Product[],
    stores: Store[],
    productStores: Record<string, string[]>
  ) {
    // Build maps once at startup
    this.brandMap = new Map(brands.map((b) => [b.id, b]));
    this.productMap = new Map(products.map((p) => [p.id, p]));
    this.storeMap = new Map(stores.map((s) => [s.id, s]));
    this.productStores = productStores;
  }

  async findBrandById(id: string): Promise<Brand | null> {
    return this.brandMap.get(id) ?? null;
  }

  async findProductById(id: string): Promise<Product | null> {
    return this.productMap.get(id) ?? null;
  }

  async findStoreById(id: string): Promise<Store | null> {
    return this.storeMap.get(id) ?? null;
  }

  async getStoreIdsByProduct(productId: string): Promise<string[]> {
    return this.productStores[productId] ?? [];
  }
}
