import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product, IProduct } from "@/lib/models/Product";

function checkAuth(request: NextRequest): boolean {
  const token = request.nextUrl.searchParams.get("token");
  const adminToken = process.env.ADMIN_TOKEN;
  return !!adminToken && token === adminToken;
}

// GET: 商品一覧取得
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST: 新規商品作成
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();

    // slugの自動生成（名前からslugを作成）
    if (!body.slug) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    // slugの重複チェック
    const existingProduct = await Product.findOne({ slug: body.slug });
    if (existingProduct) {
      // タイムスタンプを追加して一意にする
      body.slug = `${body.slug}-${Date.now()}`;
    }

    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
