
import { FileText } from "lucide-react";
import { getSeoPages } from "@/lib/gsc";
import { PagesTable } from "@/components/admin/seo/PagesTable";
import { SeoDateFilter } from "@/components/admin/seo/SeoDateFilter";

export const dynamic = 'force-dynamic';

export default async function SeoContentPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const resolvedParams = await searchParams;
  const days = parseInt(resolvedParams.days || "28");
  
  // Fetch more data for the dedicated page
  const pages = await getSeoPages(days, 50);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <FileText className="w-8 h-8 text-blue-500" />
             Desempenho de Páginas
           </h1>
           <p className="text-slate-500 mt-1">Páginas mais visitadas via busca orgânica</p>
        </div>
        <SeoDateFilter />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <PagesTable data={pages?.pages || []} />
      </div>
    </div>
  );
}
