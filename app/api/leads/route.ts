import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Lead } from "@/lib/models/Lead";
import { leadSchema } from "@/lib/validators";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = leadSchema.parse(body);

    await connectDB();

    const lead = await Lead.create(data);

    return NextResponse.json({ success: true, id: lead._id }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "入力内容に誤りがあります", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Lead creation error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
