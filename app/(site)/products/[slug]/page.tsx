import { notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Product, IProduct } from "@/lib/models/Product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatPrice } from "@/lib/utils";
import { ArrowLeft, FileText, ShoppingCart, MessageSquare, FileQuestion } from "lucide-react";
import { PurchaseForm } from "./PurchaseForm";

interface PageProps {
  params: { slug: string };
  searchParams: { paid?: string };
}

async function getProduct(slug: string): Promise<IProduct | null> {
  await connectDB();
  const product = await Product.findOne({ slug }).lean();
  return product ? (JSON.parse(JSON.stringify(product)) as IProduct) : null;
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

export default async function ProductDetailPage({ params, searchParams }: PageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const isPaid = searchParams.paid === "1";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Link */}
      <Link
        href="/products"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        製品一覧に戻る
      </Link>

      {/* Success Message */}
      {isPaid && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md mb-6">
          ご注文ありがとうございます。確認メールをお送りしました。
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={getStatusVariant(product.status)}>
                {product.status}
              </Badge>
              {product.stockQty > 0 && (
                <Badge variant="outline">在庫あり</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-lg text-muted-foreground mt-1">
              {product.manufacturer}
            </p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-sm">
              {product.memoryType}
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {product.capacityGB}GB
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {formatNumber(product.speedMT)}MT/s
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {product.formFactor}
            </Badge>
            {product.ecc && (
              <Badge variant="secondary" className="text-sm">
                ECC対応
              </Badge>
            )}
            <Badge variant="secondary" className="text-sm">
              {product.tempGrade}グレード
            </Badge>
          </div>

          {/* Description */}
          {product.shortDesc && (
            <p className="text-muted-foreground">{product.shortDesc}</p>
          )}

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>仕様</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-muted-foreground">メモリタイプ</dt>
                  <dd className="font-medium">{product.memoryType}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">容量</dt>
                  <dd className="font-medium">{product.capacityGB}GB</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">速度</dt>
                  <dd className="font-medium">
                    {formatNumber(product.speedMT)}MT/s
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">
                    フォームファクタ
                  </dt>
                  <dd className="font-medium">{product.formFactor}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">ECC</dt>
                  <dd className="font-medium">
                    {product.ecc ? "対応" : "非対応"}
                  </dd>
                </div>
                {product.voltageV && (
                  <div>
                    <dt className="text-sm text-muted-foreground">電圧</dt>
                    <dd className="font-medium">{product.voltageV}V</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm text-muted-foreground">温度グレード</dt>
                  <dd className="font-medium">{product.tempGrade}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">最小注文数</dt>
                  <dd className="font-medium">{formatNumber(product.moq)}個</dd>
                </div>
                {product.specs?.map((spec, index) => (
                  <div key={index}>
                    <dt className="text-sm text-muted-foreground">{spec.key}</dt>
                    <dd className="font-medium">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          {/* Datasheet */}
          {product.datasheetUrl && (
            <a
              href={product.datasheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:underline"
            >
              <FileText className="h-4 w-4 mr-2" />
              データシートをダウンロード
            </a>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Stock & Lead Time */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">参考在庫</p>
                  <p className="text-2xl font-bold">
                    {formatNumber(product.stockQty)}個
                  </p>
                </div>
                {product.leadTimeDays && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      リードタイム
                    </p>
                    <p className="text-lg font-semibold">
                      {product.leadTimeDays}日
                    </p>
                  </div>
                )}
                {product.referencePriceJPY && (
                  <div>
                    <p className="text-sm text-muted-foreground">参考価格</p>
                    <p className="text-lg font-semibold">
                      {formatPrice(product.referencePriceJPY)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Purchase Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                小口購入
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PurchaseForm
                slug={product.slug}
                moq={product.moq}
                hasPrice={!!product.referencePriceJPY}
              />
            </CardContent>
          </Card>

          {/* Quote Button */}
          <Link href={`/quote?product=${product.slug}`} className="block">
            <Button variant="outline" className="w-full" size="lg">
              <FileQuestion className="h-4 w-4 mr-2" />
              見積を依頼する
            </Button>
          </Link>

          {/* Contact Button */}
          <Link href={`/contact?product=${product.slug}`} className="block">
            <Button variant="secondary" className="w-full" size="lg">
              <MessageSquare className="h-4 w-4 mr-2" />
              相談する
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
