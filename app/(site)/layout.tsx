import Link from "next/link";
import { Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Cpu className="h-6 w-6 text-primary" />
            <span>MemoryPro</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/products"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              製品一覧
            </Link>
            <Link href="/quote">
              <Button variant="outline" size="sm">
                見積依頼
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="sm">お問い合わせ</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3">MemoryPro</h3>
              <p className="text-sm text-muted-foreground">
                産業用・組込み用メモリモジュールの専門店。
                高品質なメモリソリューションを提供します。
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">リンク</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/products"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    製品一覧
                  </Link>
                </li>
                <li>
                  <Link
                    href="/quote"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    見積依頼
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    お問い合わせ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">お問い合わせ</h3>
              <p className="text-sm text-muted-foreground">
                ご質問・ご相談はお気軽にどうぞ。
                <br />
                専門スタッフが対応いたします。
              </p>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MemoryPro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
