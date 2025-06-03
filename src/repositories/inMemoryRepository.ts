import { Brand, Product, Store } from "../types";

export class InMemoryRepository {
  private brands: Brand[];
  private products: Product[];
  private stores: Store[];
  private productStores: Record<string, string[]>;

  constructor(
    brands: Brand[],
    products: Product[],
    stores: Store[],
    productStores: Record<string, string[]>
  ) {
    this.brands = brands;
    this.products = products;
    this.stores = stores;
    this.productStores = productStores;
  }

  async findBrandById(id: string): Promise<Brand | null> {
    const foundBrand = this.brands.find((brand) => brand.id === id);

    return foundBrand ?? null;
  }

  async findProductById(id: string): Promise<Product | null> {
    const foundProduct = this.products.find((product) => product.id === id);
    return foundProduct ?? null;
  }

  async findStoreById(id: string): Promise<Store | null> {
    const s = this.stores.find((s) => s.id === id);
    return s ?? null;
  }

  async getStoreIdsByProduct(productId: string): Promise<string[]> {
    return this.productStores[productId] ?? [];
  }
}
