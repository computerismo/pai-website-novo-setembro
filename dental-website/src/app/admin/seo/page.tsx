
import { Search } from "lucide-react";
import { getSeoOverview, getSeoQueries, getSeoPages } from "@/lib/gsc";
import { SeoStatsCards } from "@/components/admin/seo/SeoStatsCards";
import { PerformanceChart } from "@/components/admin/seo/PerformanceChart";
import { KeywordsTable } from "@/components/admin/seo/KeywordsTable";
import { PagesTable } from "@/components/admin/seo/PagesTable";

export const dynamic = 'force-dynamic';


export default async function SeoPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const resolvedParams = await searchParams;
  const days = parseInt(resolvedParams.days || "28");
  
  // Parallel data fetching
  const [overview, queries, pages] = await Promise.all([
    getSeoOverview(days),
    getSeoQueries(days),
    getSeoPages(days)
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Search className="w-8 h-8 text-blue-500" />
          Análise de SEO (Google Search Console)
        </h1>
        {/* Date filter could go here, for now standardized to 28 days via URL */}
      </div>

      {!overview ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
           <Search className="w-5 h-5" />
           <p>Não foi possível carregar os dados. Verifique a configuração do Backend e do Google Search Console.</p>
        </div>
      ) : (
        <>
          <SeoStatsCards data={overview} />
          
          <PerformanceChart data={overview.history} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <KeywordsTable data={queries?.queries || []} />
            <PagesTable data={pages?.pages || []} />
          </div>
        </>
      )}
    </div>
  );
}

