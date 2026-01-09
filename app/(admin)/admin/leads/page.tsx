import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Lead, ILead } from "@/lib/models/Lead";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  searchParams: { token?: string };
}

async function getLeads(): Promise<ILead[]> {
  await connectDB();
  const leads = await Lead.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(leads)) as ILead[];
}

export default async function AdminLeadsPage({ searchParams }: PageProps) {
  const adminToken = process.env.ADMIN_TOKEN;

  if (!adminToken || searchParams.token !== adminToken) {
    redirect("/");
  }

  const leads = await getLeads();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">リード管理</h1>
        <Badge variant="outline">{leads.length}件</Badge>
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-muted-foreground">リードがありません</p>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <Card key={String(lead._id)} className="bg-white">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={lead.type === "見積" ? "default" : "secondary"}
                    >
                      {lead.type}
                    </Badge>
                    <span className="font-semibold">{lead.company}</span>
                    <span className="text-muted-foreground">-</span>
                    <span>{lead.name}</span>
                  </div>
                  <time className="text-sm text-muted-foreground">
                    {new Date(lead.createdAt).toLocaleString("ja-JP")}
                  </time>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">メール: </span>
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-primary hover:underline"
                    >
                      {lead.email}
                    </a>
                  </div>
                  {lead.phone && (
                    <div>
                      <span className="text-muted-foreground">電話: </span>
                      <a
                        href={`tel:${lead.phone}`}
                        className="text-primary hover:underline"
                      >
                        {lead.phone}
                      </a>
                    </div>
                  )}
                  {lead.productSlug && (
                    <div>
                      <span className="text-muted-foreground">製品: </span>
                      <span className="font-medium">{lead.productSlug}</span>
                      {lead.qty && <span className="ml-2">({lead.qty}個)</span>}
                    </div>
                  )}
                </div>
                {lead.message && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{lead.message}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
