import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { createCheckoutSession } from "@/lib/stripe";
import { checkoutSchema } from "@/lib/validators";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, qty } = checkoutSchema.parse(body);

    await connectDB();

    const product = await Product.findOne({ slug });

    if (!product) {
      return NextResponse.json(
        { error: "製品が見つかりません" },
        { status: 404 }
      );
    }

    if (qty < product.moq) {
      return NextResponse.json(
        { error: `最小注文数は${product.moq}個です` },
        { status: 400 }
      );
    }

    // Use reference price or default to 1000 JPY
    const unitPrice = product.referencePriceJPY ?? 1000;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const successUrl = `${siteUrl}/products/${slug}?paid=1`;
    const cancelUrl = `${siteUrl}/products/${slug}`;

    const session = await createCheckoutSession(
      product.name,
      unitPrice,
      qty,
      successUrl,
      cancelUrl
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "入力内容に誤りがあります", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "決済の準備中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
