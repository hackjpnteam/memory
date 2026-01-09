import { Suspense } from "react";
import { AdminLayoutContent } from "./AdminLayoutContent";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<AdminLayoutFallback>{children}</AdminLayoutFallback>}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}

function AdminLayoutFallback({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <span className="text-sm text-muted-foreground">読み込み中...</span>
          </div>
          <div className="px-6 py-4">
            <h1 className="text-xl font-bold">センチュリー管理</h1>
          </div>
        </div>
      </aside>
      <main className="pl-64">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
