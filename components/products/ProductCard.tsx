import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IProduct } from "@/lib/models/Product";
import { formatNumber } from "@/lib/utils";

interface ProductCardProps {
  product: IProduct;
}

function getStatusVariant(
  status: string
): "default" | "secondary" | "destructive" | "warning" | "success" {
  switch (status) {
    case "アクティブ":
      return "success";
    case "新規設計非推奨":
      return "warning";
    case "生産中止品":
      return "destructive";
    case "購入可能最終日あり":
      return "warning";
    default:
      return "secondary";
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-2">
            <Badge variant={getStatusVariant(product.status)} className="text-xs">
              {product.status}
            </Badge>
            {product.stockQty > 0 && (
              <Badge variant="outline" className="text-xs">
                在庫あり
              </Badge>
            )}
          </div>
          <h3 className="font-semibold text-lg leading-tight mt-2">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground">{product.manufacturer}</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5 mb-3">
            <Badge variant="secondary">{product.memoryType}</Badge>
            <Badge variant="secondary">{product.capacityGB}GB</Badge>
            <Badge variant="secondary">{formatNumber(product.speedMT)}MT/s</Badge>
            {product.ecc && <Badge variant="secondary">ECC</Badge>}
            <Badge variant="secondary">{product.formFactor}</Badge>
          </div>
          {product.shortDesc && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.shortDesc}
            </p>
          )}
          <div className="mt-3 text-sm text-muted-foreground">
            <span>参考在庫: {formatNumber(product.stockQty)}個</span>
            {product.leadTimeDays && (
              <span className="ml-3">
                リードタイム: {product.leadTimeDays}日
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
