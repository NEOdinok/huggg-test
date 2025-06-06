import { Brand, Product } from "@/data";
import { InMemoryRepository } from "@/repositories/inMemoryRepository";

export class BrandService {
  constructor(private repo: InMemoryRepository) {}

  /**
   * Returns all Product objects (own + consolidated) for a given brandId.
   * If the brand does not exist, return an empty array.
   */
  async getProductsForBrand(brandId: string): Promise<Product[] | null> {
    const brand = await this.repo.findBrandById(brandId);

    if (!brand) return null; // brand not found

    const allIds = [...brand.products, ...brand.consolidated_products];
    const products: Product[] = [];

    for (const productId of allIds) {
      const product = await this.repo.findProductById(productId);
      if (product) products.push(product);
    }

    return products;
  }
}
