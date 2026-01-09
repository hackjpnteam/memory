import { Suspense } from "react";
import { connectDB } from "@/lib/db";
import { Product, IProduct } from "@/lib/models/Product";
import { buildMongoQuery, getSortOption } from "@/lib/query";
import { productFilterSchema } from "@/lib/validators";
import { ProductFilters } from "@/components/filters/ProductFilters";
import { MobileFilters } from "@/components/filters/MobileFilters";
import { ProductList } from "@/components/products/ProductList";

export const dynamic = "force-dynamic";

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

async function getProducts(searchParams: SearchParams) {
  await connectDB();

  const params = productFilterSchema.parse({
    mfr: searchParams.mfr,
    status: searchParams.status,
    type: searchParams.type,
    form: searchParams.form,
    capMin: searchParams.capMin,
    capMax: searchParams.capMax,
    ecc: searchParams.ecc,
    speedMin: searchParams.speedMin,
    speedMax: searchParams.speedMax,
    inStock: searchParams.inStock,
    sort: searchParams.sort,
    page: searchParams.page,
    limit: searchParams.limit,
  });

  // Handle capacity filter (checkbox-based)
  const query = buildMongoQuery(params);

  // Handle capacity checkbox filter
  if (searchParams.cap) {
    const caps = String(searchParams.cap).split(",").map(Number).filter(Boolean);
    if (caps.length > 0) {
      query.capacityGB = { $in: caps };
    }
  }

  const page = params.page ?? 1;
  const limit = params.limit ?? 24;
  const skip = (page - 1) * limit;
  const sort = getSortOption(params.sort);

  const [products, total] = await Promise.all([
    Product.find(query).sort(sort).skip(skip).limit(limit).lean(),
    Product.countDocuments(query),
  ]);

  return {
    products: JSON.parse(JSON.stringify(products)) as IProduct[],
    total,
    page,
    limit,
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { products, total, page, limit } = await getProducts(searchParams);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">製品一覧</h1>

      <div className="flex gap-8">
        {/* Desktop Filters */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <h2 className="font-semibold text-lg mb-4">絞り込み</h2>
            <Suspense fallback={<div>Loading...</div>}>
              <ProductFilters />
            </Suspense>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Suspense fallback={<div>Loading...</div>}>
              <MobileFilters />
            </Suspense>
          </div>

          <Suspense fallback={<div>Loading products...</div>}>
            <ProductList
              products={products}
              total={total}
              page={page}
              limit={limit}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
