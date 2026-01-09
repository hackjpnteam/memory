import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";

function checkAuth(request: NextRequest): boolean {
  const token = request.nextUrl.searchParams.get("token");
  const adminToken = process.env.ADMIN_TOKEN;
  return !!adminToken && token === adminToken;
}

// GET: 個別商品取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const product = await Product.findById(params.id).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT: 商品更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();

    // _idは更新対象から除外
    delete body._id;

    const product = await Product.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE: 商品削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const product = await Product.findByIdAndDelete(params.id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
