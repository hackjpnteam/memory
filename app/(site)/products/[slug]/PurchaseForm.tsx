"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface PurchaseFormProps {
  slug: string;
  moq: number;
  hasPrice: boolean;
}

export function PurchaseForm({ slug, moq, hasPrice }: PurchaseFormProps) {
  const [qty, setQty] = useState(moq);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async () => {
    if (qty < moq) {
      setError(`最小注文数は${moq}個です`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, qty }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "エラーが発生しました");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="qty">数量</Label>
        <Input
          id="qty"
          type="number"
          min={moq}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          最小注文数: {moq}個
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button
        onClick={handlePurchase}
        disabled={loading || qty < moq}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            処理中...
          </>
        ) : (
          "購入手続きへ"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        {hasPrice
          ? "クレジットカードでお支払いいただけます"
          : "価格はチェックアウト時に表示されます"}
      </p>
    </div>
  );
}
