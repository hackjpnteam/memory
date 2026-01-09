import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Protect /admin/* routes
  if (pathname.startsWith("/admin")) {
    const token = searchParams.get("token");
    const adminToken = process.env.ADMIN_TOKEN;

    if (!adminToken || token !== adminToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
