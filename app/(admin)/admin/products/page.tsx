import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Product, IProduct } from "@/lib/models/Product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil } from "lucide-react";
import { DeleteProductButton } from "./DeleteProductButton";

interface PageProps {
  searchParams: { token?: string };
}

async function getProducts(): Promise<IProduct[]> {
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(products)) as IProduct[];
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const adminToken = process.env.ADMIN_TOKEN;

  if (!adminToken || searchParams.token !== adminToken) {
    redirect("/");
  }

  const products = await getProducts();
  const token = searchParams.token;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">商品管理</h1>
        <Link href={`/admin/products/new?token=${token}`}>
          <Button size="sm" className="lg:size-default">
            <Plus className="h-4 w-4 mr-1 lg:mr-2" />
            <span className="hidden sm:inline">新規商品</span>
            <span className="sm:hidden">追加</span>
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-muted-foreground mb-4">商品がありません</p>
          <Link href={`/admin/products/new?token=${token}`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              最初の商品を追加
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                    商品名
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                    タイプ
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                    容量
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                    在庫
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                    価格
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                    ステータス
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={String(product._id)} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {product.slug}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{product.memoryType}</div>
                      <div className="text-xs text-muted-foreground">
                        {product.formFactor}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{product.capacityGB}GB</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-medium ${
                          product.stockQty === 0
                            ? "text-red-600"
                            : product.stockQty <= 10
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        {product.stockQty}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {product.referencePriceJPY ? (
                        <span className="text-sm">
                          ¥{product.referencePriceJPY.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          product.status === "アクティブ" ? "default" : "secondary"
                        }
                      >
                        {product.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product._id}?token=${token}`}
                        >
                          <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <DeleteProductButton
                          productId={String(product._id)}
                          productName={product.name}
                          token={token}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {products.map((product) => (
              <Card key={String(product._id)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {product.memoryType} / {product.formFactor} / {product.capacityGB}GB
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span
                          className={`text-sm font-medium ${
                            product.stockQty === 0
                              ? "text-red-600"
                              : product.stockQty <= 10
                              ? "text-orange-600"
                              : "text-green-600"
                          }`}
                        >
                          在庫: {product.stockQty}
                        </span>
                        {product.referencePriceJPY && (
                          <span className="text-sm">
                            ¥{product.referencePriceJPY.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant={
                        product.status === "アクティブ" ? "default" : "secondary"
                      }
                      className="shrink-0"
                    >
                      {product.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                    <Link
                      href={`/admin/products/${product._id}?token=${token}`}
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        <Pencil className="h-4 w-4 mr-2" />
                        編集
                      </Button>
                    </Link>
                    <DeleteProductButton
                      productId={String(product._id)}
                      productName={product.name}
                      token={token}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
