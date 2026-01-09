import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { Lead } from "@/lib/models/Lead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, TrendingUp, AlertCircle } from "lucide-react";

interface PageProps {
  searchParams: { token?: string };
}

async function getStats() {
  await connectDB();

  const [totalProducts, activeProducts, lowStockProducts, totalLeads, recentLeads] =
    await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: "アクティブ" }),
      Product.countDocuments({ stockQty: { $lte: 10, $gt: 0 } }),
      Lead.countDocuments(),
      Lead.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
    ]);

  return { totalProducts, activeProducts, lowStockProducts, totalLeads, recentLeads };
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const adminToken = process.env.ADMIN_TOKEN;

  if (!adminToken || searchParams.token !== adminToken) {
    redirect("/");
  }

  const stats = await getStats();
  const token = searchParams.token;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総商品数</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              アクティブ: {stats.activeProducts}件
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">在庫少</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">10個以下の商品</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総リード数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              今週: +{stats.recentLeads}件
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">週間リード</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentLeads}</div>
            <p className="text-xs text-muted-foreground">過去7日間</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>クイックアクション</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href={`/admin/products/new?token=${token}`}
              className="block w-full rounded-lg border p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">新規商品を追加</div>
              <div className="text-sm text-muted-foreground">
                新しいメモリモジュールを登録
              </div>
            </Link>
            <Link
              href={`/admin/products?token=${token}`}
              className="block w-full rounded-lg border p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">商品一覧を見る</div>
              <div className="text-sm text-muted-foreground">
                価格・在庫を編集
              </div>
            </Link>
            <Link
              href={`/admin/leads?token=${token}`}
              className="block w-full rounded-lg border p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">リード一覧を見る</div>
              <div className="text-sm text-muted-foreground">
                お問い合わせ・見積依頼を確認
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
