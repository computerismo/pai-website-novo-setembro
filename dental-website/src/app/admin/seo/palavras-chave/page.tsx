
import { Search, TrendingUp } from "lucide-react";
import { getSeoQueries } from "@/lib/gsc";
import { KeywordsTable } from "@/components/admin/seo/KeywordsTable";

export const dynamic = 'force-dynamic';

export default async function SeoKeywordsPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const resolvedParams = await searchParams;
  const days = parseInt(resolvedParams.days || "28");
  
  // Fetch more data for the dedicated page
  const queries = await getSeoQueries(days, 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <Search className="w-8 h-8 text-blue-500" />
             Palavras-chave
           </h1>
           <p className="text-slate-500 mt-1">Termos que geram tráfego para seu site (Top 100)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* We can add a specialized "Opportunities" card here later showing high impression/low CTR queries */}
        
        <KeywordsTable data={queries?.queries || []} />
      </div>
    </div>
  );
}
