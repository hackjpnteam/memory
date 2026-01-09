import { FilterQuery } from "mongoose";
import { IProduct } from "./models/Product";
import { ProductFilter } from "./validators";

export type SortOption = {
  label: string;
  value: string;
  sort: Record<string, 1 | -1>;
};

export const SORT_OPTIONS: SortOption[] = [
  { label: "おすすめ", value: "recommended", sort: { createdAt: -1 } },
  { label: "在庫多い", value: "stock-desc", sort: { stockQty: -1 } },
  { label: "リードタイム短い", value: "lead-asc", sort: { leadTimeDays: 1 } },
  { label: "容量大きい", value: "cap-desc", sort: { capacityGB: -1 } },
  { label: "速度速い", value: "speed-desc", sort: { speedMT: -1 } },
];

export function buildMongoQuery(
  params: ProductFilter
): FilterQuery<IProduct> {
  const query: FilterQuery<IProduct> = {};

  // Manufacturer filter (CSV)
  if (params.mfr) {
    const manufacturers = params.mfr.split(",").filter(Boolean);
    if (manufacturers.length > 0) {
      query.manufacturer = { $in: manufacturers };
    }
  }

  // Status filter (CSV)
  if (params.status) {
    const statuses = params.status.split(",").filter(Boolean);
    if (statuses.length > 0) {
      query.status = { $in: statuses };
    }
  }

  // Memory type filter (CSV)
  if (params.type) {
    const types = params.type.split(",").filter(Boolean);
    if (types.length > 0) {
      query.memoryType = { $in: types };
    }
  }

  // Form factor filter (CSV)
  if (params.form) {
    const forms = params.form.split(",").filter(Boolean);
    if (forms.length > 0) {
      query.formFactor = { $in: forms };
    }
  }

  // Capacity range
  if (params.capMin !== undefined || params.capMax !== undefined) {
    query.capacityGB = {};
    if (params.capMin !== undefined) {
      query.capacityGB.$gte = params.capMin;
    }
    if (params.capMax !== undefined) {
      query.capacityGB.$lte = params.capMax;
    }
  }

  // ECC filter
  if (params.ecc !== undefined) {
    query.ecc = params.ecc === "true";
  }

  // Speed range
  if (params.speedMin !== undefined || params.speedMax !== undefined) {
    query.speedMT = {};
    if (params.speedMin !== undefined) {
      query.speedMT.$gte = params.speedMin;
    }
    if (params.speedMax !== undefined) {
      query.speedMT.$lte = params.speedMax;
    }
  }

  // In stock only
  if (params.inStock === "true") {
    query.stockQty = { $gt: 0 };
  }

  return query;
}

export function getSortOption(sortValue?: string): Record<string, 1 | -1> {
  const option = SORT_OPTIONS.find((o) => o.value === sortValue);
  return option?.sort ?? SORT_OPTIONS[0].sort;
}

export function buildUrlParams(filters: Partial<ProductFilter>): string {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  return params.toString();
}
