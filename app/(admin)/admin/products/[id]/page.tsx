import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { connectDB } from "@/lib/db";
import { Product, IProduct } from "@/lib/models/Product";
import { ProductForm } from "../ProductForm";

interface PageProps {
  params: { id: string };
  searchParams: { token?: string };
}

async function getProduct(id: string): Promise<IProduct | null> {
  await connectDB();
  const product = await Product.findById(id).lean();
  if (!product) return null;
  return JSON.parse(JSON.stringify(product)) as IProduct;
}

export default async function EditProductPage({
  params,
  searchParams,
}: PageProps) {
  const adminToken = process.env.ADMIN_TOKEN;

  if (!adminToken || searchParams.token !== adminToken) {
    redirect("/");
  }

  const product = await getProduct(params.id);

  if (!product) {
    notFound();
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
        <h1 className="text-2xl font-bold">商品編集</h1>
        <p className="text-muted-foreground">{product.name}</p>
      </div>

      <ProductForm product={product} token={token} mode="edit" />
    </div>
  );
}
