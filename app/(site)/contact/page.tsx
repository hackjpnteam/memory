import { Suspense } from "react";
import { LeadForm } from "@/components/LeadForm";

interface PageProps {
  searchParams: { product?: string };
}

export default function ContactPage({ searchParams }: PageProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">お問い合わせ</h1>
      <p className="text-muted-foreground mb-8">
        製品に関するご質問、技術的なご相談など、お気軽にお問い合わせください。
        専門スタッフが対応いたします。
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <LeadForm type="相談" productSlug={searchParams.product} />
      </Suspense>
    </div>
  );
}
