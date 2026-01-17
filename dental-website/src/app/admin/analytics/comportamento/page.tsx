'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowRight,
  RefreshCw,
  Map,
  Zap,
  AlertTriangle,
  Timer,
  ArrowDownRight,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import Link from 'next/link';
import { 
  getTopPages, 
  getPageviewsSeries, 
  getLandingPages,
  type TopPagesResponse, 
  type PageviewsSeriesResponse,
  type LandingPagesResponse
} from '@/lib/analytics/ga4-api';

// Types
interface BehaviorData {
  topPages: TopPagesResponse['pages'];
  pageviews: PageviewsSeriesResponse['pageviews'];
  landingPages: LandingPagesResponse['landingPages'];
  period: string;
}

// Constants
const PERIODS = [
  { value: '24h', label: 'Últimas 24h' },
  { value: '7d', label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
  { value: '90d', label: 'Últimos 90 dias' },
];

// Helpers
function formatPagePath(path: string): string {
  if (path === '/') return 'Início';
  if (!path) return 'Desconhecido';
  return path.replace(/^\//, '').replace(/\/$/, '') || 'Início';
}

function formatTime(seconds: number): string {
  if (!seconds) return '0s';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
}

// Filter admin pages
const isPublicPage = (path: string) => {
  if (!path) return false;
  return !path.startsWith('/admin') && !path.startsWith('/login');
};

// Insight Card
function InsightCard({ 
  title, 
  value, 
  subtext, 
  icon: Icon,
  colorClass = "text-blue-600",
  bgClass = "bg-blue-50",
}: { 
  title: string; 
  value: string; 
  subtext?: string; 
  icon: React.ElementType;
  colorClass?: string;
  bgClass?: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-xl ${bgClass}`}>
        <Icon className={`w-5 h-5 ${colorClass}`} />
      </div>
    </div>
  );
}

// Flow Card
function FlowCard({ 
  entryPages, 
  topPages 
}: { 
  entryPages: LandingPagesResponse['landingPages']; 
  topPages: TopPagesResponse['pages'];
}) {
  const filteredEntries = entryPages.filter(p => isPublicPage(p.x)).slice(0, 5);
  const filteredTop = topPages.filter(p => isPublicPage(p.x)).slice(0, 5);
  const totalVisitors = filteredTop.reduce((acc, curr) => acc + curr.visitors, 0);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm col-span-1 lg:col-span-3">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Map className="w-5 h-5 text-blue-500" />
        Fluxo de Navegação
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {/* Entry */}
        <div className="bg-white border-2 border-emerald-50 rounded-xl p-4 hover:border-emerald-100 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-emerald-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Entrada
            </h4>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Top 5</span>
          </div>
          <div className="space-y-3">
            {filteredEntries.length > 0 ? filteredEntries.map((p, i) => (
              <div key={i} className="flex justify-between items-center text-sm group">
                <span className="truncate max-w-[150px] text-slate-600 font-medium group-hover:text-emerald-700 transition-colors" title={p.x}>
                  {formatPagePath(p.x)}
                </span>
                <span className="font-bold text-slate-900">{p.y}</span>
              </div>
            )) : (
               <p className="text-sm text-slate-400 py-2">Sem dados de entrada</p>
            )}
          </div>
        </div>

        {/* Core */}
        <div className="bg-white border-2 border-blue-50 rounded-xl p-4 hover:border-blue-100 transition-colors text-center flex flex-col justify-center min-h-[160px]">
          <h4 className="font-bold text-blue-900 mb-2">Engajamento Central</h4>
          <p className="text-4xl font-bold text-blue-600 mb-1">
            {totalVisitors.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Visitantes nos Principais Conteúdos</p>
        </div>

        {/* Top Pages (as exit proxy) */}
        <div className="bg-white border-2 border-orange-50 rounded-xl p-4 hover:border-orange-100 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-orange-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              Mais Visitadas
            </h4>
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Top 5</span>
          </div>
          <div className="space-y-3">
            {filteredTop.length > 0 ? filteredTop.map((p, i) => (
              <div key={i} className="flex justify-between items-center text-sm group">
                <span className="truncate max-w-[150px] text-slate-600 font-medium group-hover:text-orange-700 transition-colors" title={p.x}>
                  {formatPagePath(p.x)}
                </span>
                <span className="font-bold text-slate-900">{p.y}</span>
              </div>
             )) : (
              <p className="text-sm text-slate-400 py-2">Sem dados</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Page Performance Lists
function PagePerformanceLists({ pages }: { pages: TopPagesResponse['pages'] }) {
  const filteredPages = pages.filter(p => isPublicPage(p.x));
  
  // Sticky: High Time on Page (> 30s)
  const stickyPages = [...filteredPages]
    .filter(p => p.avgTime > 30)
    .sort((a, b) => b.avgTime - a.avgTime)
    .slice(0, 5);

  // Slippery: High Bounce (> 50%)
  const slipperyPages = [...filteredPages]
    .filter(p => p.bounceRate > 50)
    .sort((a, b) => b.bounceRate - a.bounceRate)
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sticky Pages */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          Páginas "Cola" (Alto Engajamento)
        </h3>
        <div className="overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
              <tr>
                <th className="px-3 py-2 rounded-l-lg">Página</th>
                <th className="px-3 py-2 text-right rounded-r-lg">Tempo Médio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stickyPages.length > 0 ? stickyPages.map((p, i) => (
                <tr key={i} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-3 font-medium text-slate-700 truncate max-w-[180px]" title={p.x}>
                    {formatPagePath(p.x)}
                  </td>
                  <td className="px-3 py-3 text-right text-emerald-600 font-bold">
                    {formatTime(p.avgTime)}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={2} className="px-3 py-6 text-center text-slate-400">Nenhuma página de alto engajamento ainda.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slippery Pages */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <ArrowDownRight className="w-5 h-5 text-orange-500" />
          Páginas "Escorregadias" (Alta Rejeição)
        </h3>
        <div className="overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
              <tr>
                <th className="px-3 py-2 rounded-l-lg">Página</th>
                <th className="px-3 py-2 text-right rounded-r-lg">Rejeição</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {slipperyPages.length > 0 ? slipperyPages.map((p, i) => (
                <tr key={i} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-3 font-medium text-slate-700 truncate max-w-[180px]" title={p.x}>
                    {formatPagePath(p.x)}
                  </td>
                  <td className="px-3 py-3 text-right text-orange-600 font-bold">
                    {p.bounceRate.toFixed(0)}%
                  </td>
                </tr>
              )) : (
                 <tr><td colSpan={2} className="px-3 py-6 text-center text-slate-400">Nenhuma página com alta rejeição.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Traffic Trend Chart
function TrafficTrendCard({ data }: { data: PageviewsSeriesResponse['pageviews'] }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Tendência de Tráfego
        </h3>
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-xs font-medium text-blue-700">Visualizações</span>
        </div>
      </div>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis 
              dataKey="x" 
              fontSize={10} 
              stroke="#94a3b8" 
              tickFormatter={(val) => {
                const d = new Date(val);
                return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
              }}
              tickMargin={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              fontSize={10} 
              stroke="#94a3b8" 
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              labelFormatter={(label) => new Date(label).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
            />
            <Area 
              type="monotone" 
              dataKey="y" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              fill="url(#colorViews)" 
              name="Visualizações"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Main Page
export default function ComportamentoPage() {
  const [data, setData] = useState<BehaviorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('7d');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [topPagesRes, pageviewsRes, landingPagesRes] = await Promise.all([
        getTopPages(period, 20),
        getPageviewsSeries(period),
        getLandingPages(period, 10),
      ]);
      
      setData({
        topPages: topPagesRes.pages,
        pageviews: pageviewsRes.pageviews,
        landingPages: landingPagesRes.landingPages,
        period,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  const publicPages = data?.topPages.filter(p => isPublicPage(p.x)) || [];
  const topPage = publicPages[0];
  const avgBounce = publicPages.length > 0 
    ? publicPages.reduce((acc, p) => acc + p.bounceRate, 0) / publicPages.length 
    : 0;
  const avgTime = publicPages.length > 0 
    ? publicPages.reduce((acc, p) => acc + p.avgTime, 0) / publicPages.length 
    : 0;

  if (loading && !data) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-500">Carregando análise...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-xl border border-red-100 text-center">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <h3 className="text-lg font-bold text-red-900">Erro ao carregar</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button onClick={fetchData} className="px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg shadow-sm hover:bg-red-50">
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link href="/admin/analytics" className="hover:text-blue-600">Análise de Tráfego</Link>
            <ArrowRight className="w-3 h-3" />
            <span className="text-slate-900 font-medium">Comportamento</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Comportamento</h1>
          <p className="text-slate-500">Análise de jornada e engajamento</p>
        </div>
        
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                period === p.value 
                  ? 'bg-slate-800 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {data && (
        <>
          {/* Global Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InsightCard 
              title="Tempo Médio Global" 
              value={formatTime(avgTime)} 
              subtext="Média em todas as páginas" 
              icon={Timer}
              colorClass="text-blue-600"
              bgClass="bg-blue-50"
            />
            <InsightCard 
              title="Taxa de Rejeição Média" 
              value={`${avgBounce.toFixed(1)}%`} 
              subtext="Visitantes que saíram direto" 
              icon={ArrowUpRight}
              colorClass="text-orange-600"
              bgClass="bg-orange-50"
            />
             <InsightCard 
              title="Página Mais Popular" 
              value={topPage ? formatPagePath(topPage.x) : '-'} 
              subtext={`${topPage?.visitors || 0} visitantes únicos`} 
              icon={Zap}
              colorClass="text-purple-600"
              bgClass="bg-purple-50"
            />
          </div>

          {/* Flow */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <FlowCard 
              entryPages={data.landingPages}
              topPages={data.topPages}
            />
          </div>

          {/* Performance Lists */}
          <PagePerformanceLists pages={data.topPages} />

          {/* Traffic Trend */}
          <TrafficTrendCard data={data.pageviews} />
        </>
      )}
    </div>
  );
}
