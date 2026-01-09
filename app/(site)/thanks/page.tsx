import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface PageProps {
  searchParams: { type?: string };
}

export default function ThanksPage({ searchParams }: PageProps) {
  const type = searchParams.type === "見積" ? "見積依頼" : "お問い合わせ";

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">
            {type}を受け付けました
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            お問い合わせいただきありがとうございます。
            <br />
            担当者より折り返しご連絡いたします。
          </p>
          <div className="pt-4">
            <Link href="/products">
              <Button>製品一覧に戻る</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
