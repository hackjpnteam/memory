"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { LeadType } from "@/lib/models/Lead";

interface LeadFormProps {
  type: LeadType;
  productSlug?: string;
  qty?: number;
}

export function LeadForm({ type, productSlug, qty }: LeadFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      type,
      company: formData.get("company") as string,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string || null,
      message: formData.get("message") as string,
      productSlug: productSlug || null,
      qty: qty || null,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "エラーが発生しました");
      }

      router.push(`/thanks?type=${type}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {productSlug && (
            <div className="bg-muted p-3 rounded-md text-sm">
              <span className="text-muted-foreground">対象製品: </span>
              <span className="font-medium">{productSlug}</span>
              {qty && (
                <>
                  <span className="text-muted-foreground ml-2">数量: </span>
                  <span className="font-medium">{qty}個</span>
                </>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="company">
              会社名 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="company"
              name="company"
              required
              placeholder="株式会社○○"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="name">
              お名前 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="山田 太郎"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">
              メールアドレス <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="example@company.co.jp"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone">電話番号</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="03-1234-5678"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="message">
              {type === "見積" ? "ご要望・備考" : "お問い合わせ内容"}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder={
                type === "見積"
                  ? "ご希望の数量、納期、その他ご要望をお知らせください。"
                  : "ご質問やご相談内容をお知らせください。"
              }
              className="mt-1"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                送信中...
              </>
            ) : (
              "送信する"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
