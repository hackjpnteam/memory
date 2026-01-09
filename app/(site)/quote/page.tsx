import { Suspense } from "react";
import { LeadForm } from "@/components/LeadForm";

interface PageProps {
  searchParams: { product?: string; qty?: string };
}

export default function QuotePage({ searchParams }: PageProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">見積依頼</h1>
      <p className="text-muted-foreground mb-8">
        ご希望の製品について、お見積りをお送りいたします。
        下記フォームにご記入の上、送信してください。
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <LeadForm
          type="見積"
          productSlug={searchParams.product}
          qty={searchParams.qty ? Number(searchParams.qty) : undefined}
        />
      </Suspense>
    </div>
  );
}
