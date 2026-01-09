import Link from "next/link";
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
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="text-xl font-bold text-[#93307C]">CENTURY</span>
              <span className="text-[10px] text-[#93307C] ml-0.5">MICRO</span>
            </div>
          </Link>
          <nav className="hidden sm:flex items-center gap-4">
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
          {/* Mobile Nav */}
          <nav className="sm:hidden flex items-center gap-2">
            <Link href="/products" className="text-xs font-medium hover:text-primary">
              製品
            </Link>
            <Link href="/contact">
              <Button size="sm" className="text-xs px-2 py-1 h-7">問い合わせ</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-[#93307C] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-3">CENTURY MICRO</h3>
              <p className="text-sm text-white/80">
                産業用・組込み用メモリモジュールの専門メーカー。
                高品質なメモリソリューションを提供します。
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">リンク</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/products"
                    className="text-white/80 hover:text-white"
                  >
                    製品一覧
                  </Link>
                </li>
                <li>
                  <Link
                    href="/quote"
                    className="text-white/80 hover:text-white"
                  >
                    見積依頼
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-white/80 hover:text-white"
                  >
                    お問い合わせ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">お問い合わせ</h3>
              <p className="text-sm text-white/80">
                ご質問・ご相談はお気軽にどうぞ。
                <br />
                専門スタッフが対応いたします。
              </p>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/60">
            &copy; {new Date().getFullYear()} Century Micro Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
