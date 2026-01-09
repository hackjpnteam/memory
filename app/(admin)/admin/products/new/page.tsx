import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProductForm } from "../ProductForm";

interface PageProps {
  searchParams: { token?: string };
}

export default function NewProductPage({ searchParams }: PageProps) {
  const adminToken = process.env.ADMIN_TOKEN;

  if (!adminToken || searchParams.token !== adminToken) {
    redirect("/");
  }

  const token = searchParams.token;

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/admin/products?token=${token}`}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          商品一覧に戻る
        </Link>
        <h1 className="text-2xl font-bold">新規商品追加</h1>
      </div>

      <ProductForm token={token} mode="create" />
    </div>
  );
}
