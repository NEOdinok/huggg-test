# Hey Huggg people 🫂🫂🫂

Welcome to the Huggg tech test! Below you’ll find:

---

## How to Start the Project

**Install dependencies**

```bash
pnpm install
pnpm run dev
```

## How to run tests

**Jest tests**

```bash
pnpm test
```

**Vitest tests (much faster)**

```bash
pnpm vitest
```

## Data and relationships

`brands.json` contain array of brands, all products, all stores.

```ts
Brand A
  • id = “brand-A”
  • products = [ “prod-1”, “prod-2” ]
  • consolidated_products = [ “prod-3” ]
  • stores = [ “store-1”, “store-2” ]

  → In embedded.products:
      – Product “prod-1” has brand_id = “brand-A”
      – Product “prod-2” has brand_id = “brand-A”
      – Product “prod-3” has brand_id = “brand-B” (its “true” parent might be Brand B, but Brand A also lists it in its consolidated_products)
  → In embedded.stores:
      – Store “store-1” has brand_id = “brand-A”
      – Store “store-2” has brand_id = “brand-A”

Brand B
  • id = “brand-B”
  • products = [ “prod-3”, “prod-4” ]
  • consolidated_products = []
  • stores = [ “store-3” ]

  → Product “prod-3” has brand_id = “brand-B”
  → Product “prod-4” has brand_id = “brand-B”
  → Store “store-3” has brand_id = “brand-B”
```

## Why those endpoints ?

We have only two of **those endpoints** because the task explicitly asked for:

- “Get all product entities for a brand by brand-ID”
- “Get all store entities for a product by product-ID.”

## Logic walkthrough (Request to JSON)

### GET /brands/:brandId/products

1. Client calls GET /brands/:brandId/products (optionally with ?page=&per_page=).
2. Route handler (src/routes/brandRoutes.ts):

- Extracts brandId from path params.
- Parses page and per_page via helpers to ensure valid positive integers (clamping invalid or missing values to 1).
- Calls BrandService.getProductsForBrand(brandId).

3. Service (src/services/brandService.ts):

- Looks up the Brand in our in-memory Map O(1). If not found, returns null.
- Merges brand.products and brand.consolidated_products into one array.
- For each product ID, looks up the full Product object in another Map O(1).
- Returns Product[] (may be empty).

4. Route handler:

- If service returned null → respond 404 { "message": "Brand not found." }
- Otherwise paginate the Product[] with getPagination(totalItems, page, itemsPerPage).

Respond with:

```json
{
  "data": [/* up to per_page Product objects */],
  "meta": {
    "totalItems": <number>,
    "itemsPerPage": <number>,
    "lastPage": <number>,
    "page": <number>
  }
}
```

### GET /products/:productId/stores

works the same way

## Why We Build Maps In Memory

In our mock environment, all data lives in a local brands.json.

- **BrandMap**: id → Brand

- **ProductMap**: id → Product

- **StoreMap**: id → Store

Every lookup (e.g. findBrandById("brand-A")) is O(1) instead of O(N).
We also pre-compute productToStoreIds: Record<string, string[]> so that Product → [Store IDs] is a single, constant-time object lookup.

### In the real world

You wouldn’t ship a gigantic in-memory JSON—your data would live in a database (PostgreSQL, MySQL, MongoDB, etc.).  
The database would already index id as a primary key, giving **O(log N)** (or effectively **O(1)**) access.

If you need ultra-high throughput or sub-millisecond latency, you might put “hot” entities into a Redis cache.

- On a cache miss, read from the database and then store the row in Redis with a TTL (cache-aside pattern).
- On an update, delete or update the Redis key so nothing goes stale.

In-memory maps are only viable when the dataset is small and infrequently updated.  
In production, a combination of **DB indexes** (for most lookups) plus **Redis** (for caching hot rows) is typical.

**Test queries:**

```bash
# Get all stores for a product
GET /products/26f7a82a-30a8-44e4-93cb-499a256d0ce9/stores

# Get all products for a brand
GET /brands/5a4e6d14-53d4-4583-bd6b-49f81b021d24/products

# Get paginated products for a brand
GET /brands/a715b837-f4fc-48ba-ba0a-7f53b6dc59c5/products?per_page=1&page=1
```
