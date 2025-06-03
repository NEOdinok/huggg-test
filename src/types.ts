export interface Brand {
  id: string;
  name: string;
  // “real” dataset might have more fields;
  // we only need these two arrays for our endpoint
  products: string[]; // “own” product IDs
  consolidated_products: string[]; // any “consolidated” product IDs that also belong here
}

export interface Product {
  id: string;
  name: string;
}

export interface Store {
  id: string;
  name: string;
}
