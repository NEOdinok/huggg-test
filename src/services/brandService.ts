import { Product } from "@/data";
import { InMemoryRepository } from "@/repositories/inMemoryRepository";

export class BrandService {
  constructor(private repo: InMemoryRepository) {}

  async getProductsForBrand(brandId: string): Promise<Product[] | null> {
    const brand = await this.repo.findBrandById(brandId);

    if (!brand) return null; // brand not found

    const ids = new Set([...brand.products, ...brand.consolidated_products]);

    const productPromises = Array.from(ids).map((id) =>
      this.repo.findProductById(id)
    );

    const productResults = await Promise.all(productPromises);

    return productResults.filter((product): product is Product => !!product);
  }
}
