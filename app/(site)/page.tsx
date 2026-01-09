import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  FileQuestion,
  MessageSquare,
  Cpu,
  Shield,
  Zap,
  Package,
} from "lucide-react";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#93307C]/10 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            産業用・組込み用メモリ専門メーカー
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-[#93307C]">高品質</span>メモリモジュールを
            <br />
            あなたのプロジェクトに
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            DDR4/DDR5、ECC対応、産業グレードなど幅広いラインナップ。
            スペック検索で最適な製品を見つけ、すぐに見積・相談が可能です。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto">
                <Search className="h-5 w-5 mr-2" />
                製品を探す
              </Button>
            </Link>
            <Link href="/quote">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <FileQuestion className="h-5 w-5 mr-2" />
                見積依頼
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="text-[#93307C]">CENTURY MICRO</span>が選ばれる理由
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Cpu className="h-10 w-10 text-[#93307C] mb-2" />
                <CardTitle>豊富なラインナップ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  DDR4/DDR5、各種フォームファクタ、産業グレードまで幅広く取り揃えています。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Search className="h-10 w-10 text-[#93307C] mb-2" />
                <CardTitle>高度なスペック検索</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  メモリタイプ、容量、速度、ECC対応など、細かな条件で絞り込みが可能です。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-[#93307C] mb-2" />
                <CardTitle>高い信頼性</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Samsung、SK hynix、Micronなど信頼の半導体を採用した高品質モジュール。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-[#93307C] mb-2" />
                <CardTitle>迅速な対応</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  見積依頼やお問い合わせに専門スタッフが迅速に対応いたします。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Memory Types Section */}
      <section className="py-16 bg-[#93307C]/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            取り扱いメモリタイプ
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {["DDR5", "DDR4", "DDR3", "LPDDR5", "LPDDR4", "その他"].map(
              (type) => (
                <Link
                  key={type}
                  href={`/products?type=${encodeURIComponent(type)}`}
                >
                  <Card className="hover:border-[#93307C] transition-colors cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <p className="font-semibold">{type}</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-[#93307C] text-white rounded-2xl p-8 md:p-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">
              お探しの製品が見つからない場合は
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              掲載していない製品やカスタム要件についても対応可能です。
              お気軽にご相談ください。
            </p>
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="bg-white text-[#93307C] hover:bg-white/90">
                <MessageSquare className="h-5 w-5 mr-2" />
                お問い合わせ
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
