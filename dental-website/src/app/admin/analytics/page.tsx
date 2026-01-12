import { BarChart3, Construction } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Análise de Tráfego</h1>
        <p className="text-slate-500 mt-1">Métricas e insights do site via Umami Analytics</p>
      </div>

      {/* Coming Soon Card */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-6">
          <Construction className="w-10 h-10 text-amber-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Em Construção
        </h2>
        
        <p className="text-slate-500 max-w-md mb-6">
          Estamos preparando a integração com o Umami Analytics para trazer métricas detalhadas sobre o tráfego do seu site.
        </p>

        <div className="flex items-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span>Visitantes</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
          <div className="flex items-center gap-2">
            <span>Páginas mais vistas</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
          <div className="flex items-center gap-2">
            <span>Origens de tráfego</span>
          </div>
        </div>
      </div>
    </div>
  );
}
