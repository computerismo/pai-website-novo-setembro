
import { ShieldCheck } from "lucide-react";
import { getSitemaps } from "@/lib/gsc";
import { SitemapsStatus } from "@/components/admin/seo/SitemapsStatus";

export const dynamic = 'force-dynamic';

export default async function SeoTechnicalPage() {
  const sitemaps = await getSitemaps();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <ShieldCheck className="w-8 h-8 text-blue-500" />
             Técnico & Indexação
           </h1>
           <p className="text-slate-500 mt-1">Status de conexão com o Google e Sitemaps</p>
        </div>
      </div>

      <SitemapsStatus data={sitemaps?.sitemaps || []} />
    </div>
  );
}
