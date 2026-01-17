
import { SeoPage } from "@/lib/types/seo";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface PagesTableProps {
  data: SeoPage[];
}

export function PagesTable({ data }: PagesTableProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Páginas Mais Visitadas (Google)</h3>
        <p className="text-sm text-slate-500">
          Páginas com melhor desempenho na pesquisa orgânica
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3 rounded-l-lg">Página</th>
              <th className="px-4 py-3 text-right">Cliques</th>
              <th className="px-4 py-3 text-right">Impressões</th>
              <th className="px-4 py-3 text-right">CTR</th>
              <th className="px-4 py-3 text-right rounded-r-lg">Pos. Média</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-900">
                  <Link 
                    href={item.page} 
                    target="_blank" 
                    className="flex items-center gap-2 hover:text-blue-600 transition-colors group"
                  >
                    <span className="truncate max-w-[300px]">{item.page.replace(/^https?:\/\/[^/]+/, '') || '/'}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </td>
                <td className="px-4 py-3 text-right font-medium text-slate-700">{item.clicks.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-slate-500">{item.impressions.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-slate-500">{(item.ctr * 100).toFixed(2)}%</td>
                <td className="px-4 py-3 text-right text-slate-500">{item.position.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
