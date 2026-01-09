"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Package, Users, LayoutDashboard, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/admin/products", label: "商品管理", icon: Package },
  { href: "/admin/leads", label: "リード管理", icon: Users },
];

export function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-6">
            <Link href={`/`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
              サイトに戻る
            </Link>
          </div>
          <div className="px-6 py-4">
            <h1 className="text-xl font-bold">センチュリー管理</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={`${item.href}?token=${token}`}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="pl-64">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
