"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { IProduct } from "@/lib/models/Product";
import { ProductCard } from "./ProductCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SORT_OPTIONS } from "@/lib/query";
import { formatNumber } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductListProps {
  products: IProduct[];
  total: number;
  page: number;
  limit: number;
}

export function ProductList({ products, total, page, limit }: ProductListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(total / limit);

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`/products?${params.toString()}`);
  };

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    updateParams("page", String(newPage));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-lg font-semibold">
          {formatNumber(total)}品目
        </p>
        <Select
          value={searchParams.get("sort") ?? "recommended"}
          onValueChange={(value) => updateParams("sort", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="並び替え" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>条件に一致する製品が見つかりませんでした。</p>
          <p className="text-sm mt-2">フィルタ条件を変更してお試しください。</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm px-4">
            {page} / {totalPages} ページ
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
