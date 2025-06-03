import { Brand, Product } from "../types";

export class InMemoryRepository {
  private brands: Brand[];
  private products: Product[];

  constructor(brands: Brand[], products: Product[]) {
    this.brands = brands;
    this.products = products;
  }

  async findBrandById(id: string): Promise<Brand | null> {
    const foundBrand = this.brands.find((brand) => brand.id === id);

    return foundBrand ?? null;
  }

  async findProductById(id: string): Promise<Product | null> {
    const foundProduct = this.products.find((product) => product.id === id);
    return foundProduct ?? null;
  }
}
