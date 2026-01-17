
import { SitemapStatus } from "@/lib/types/seo";
import { CheckCircle2, AlertTriangle, FileText, CalendarClock } from "lucide-react";
import StatsCard from "../StatsCard";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SitemapsStatusProps {
  data: SitemapStatus[];
}

export function SitemapsStatus({ data }: SitemapsStatusProps) {
  if (!data) return null;

  const totalSitemaps = data.length;
  const withErrors = data.filter(s => (s.errors || 0) > 0 || (s.warnings || 0) > 0).length;
  const health = withErrors === 0 ? "healthy" : "warning";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <StatsCard
            title="Sitemaps Enviados"
            value={totalSitemaps}
            icon={FileText}
            color="blue"
          />
         <StatsCard
            title="Status da Indexação"
            value={health === "healthy" ? "Saudável" : "Atenção"}
            icon={health === "healthy" ? CheckCircle2 : AlertTriangle}
            color={health === "healthy" ? "green" : "orange"}
          />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Sitemaps</h3>
          <p className="text-sm text-slate-500">
            Status dos arquivos de sitemap enviados ao Google
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Sitemap</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Último Envio</th>
                <th className="px-4 py-3">Última Leitura</th>
                <th className="px-4 py-3 text-right">Erros</th>
                <th className="px-4 py-3 text-right rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900 truncate max-w-[200px]" title={item.path}>
                    {item.path.split('/').pop()}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {item.isSitemapsIndex ? 'Índice' : 'Arquivo'}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                     {item.lastSubmitted ? format(parseISO(item.lastSubmitted), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                     {item.lastCrawled ? format(parseISO(item.lastCrawled), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500">
                    {item.errors || 0}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {item.isPending ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        Pendente
                      </span>
                    ) : (item.errors || 0) > 0 ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Erro
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Sucesso
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                   <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      Nenhum sitemap encontrado. Verifique se você enviou seu sitemap no Google Search Console.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
