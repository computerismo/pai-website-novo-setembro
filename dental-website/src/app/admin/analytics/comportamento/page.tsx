'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowRight,
  RefreshCw,
  Map,
  Zap,
  Target,
  AlertTriangle,
  Clock,
  Filter,
  TrendingUp,
  Timer,
  MousePointerClick,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  ScatterChart, 
  Scatter, 
  ZAxis,
  ReferenceLine,
  AreaChart,
  Area,
  Tooltip,
} from 'recharts';

// === Types ===
interface MetricData {
  x: string;
  y: number;
}

interface ExpandedMetricData {
  name: string;
  pageviews: number;
  visitors: number;
  bounces: number;
  totaltime: number;
}

interface EventSeries {
  x: string;
  t: string;
  y: number;
}

interface BehaviorData {
  topPages: MetricData[];
  topPagesExpanded: ExpandedMetricData[];
  entryPages: MetricData[];
  exitPages: MetricData[];
  events: MetricData[];
  eventsSeries: EventSeries[];
  pageviews: MetricData[]; // Format: { x: date, y: views }
  sessionsWeekly: number[][];
  period: string;
}

// === Constants ===
const PERIODS = [
  { value: '24h', label: 'Últimas 24h' },
  { value: '7d', label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
  { value: '90d', label: 'Últimos 90 dias' },
];

const COLORS = {
  primary: '#3b82f6',   // Blue
  success: '#10b981',   // Emerald
  warning: '#f59e0b',   // Amber
  danger: '#ef4444',    // Red
  accent: '#8b5cf6',    // Purple
  neutral: '#94a3b8',   // Slate-400
  grid: '#e2e8f0'       // Slate-200
};

// === Helpers ===
function formatPagePath(path: string): string {
  if (path === '/') return 'Início';
  if (!path) return 'Desconhecido';
  // Strip slashes for cleaner look
  return path.replace(/^\//, '').replace(/\/$/, '') || 'Início';
}

function formatTime(seconds: number): string {
  if (!seconds) return '0s';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
}

// Filter Logic - CRITICAL: Exclude admin pages
const isPublicPage = (path: string) => {
  if (!path) return false;
  return !path.startsWith('/admin') && !path.startsWith('/login');
};

// === Components ===

// 1. Overview Metric Card
function InsightCard({ 
  title, 
  value, 
  subtext, 
  icon: Icon,
  colorClass = "text-blue-600",
  bgClass = "bg-blue-50",
  trend
}: { 
  title: string; 
  value: string; 
  subtext?: string; 
  icon: React.ElementType;
  colorClass?: string;
  bgClass?: string;
  trend?: 'up' | 'down' | 'neutral';
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

// 2. Navigation Flow Card
function FlowCard({ 
  entryPages, 
  exitPages,
  topPages 
}: { 
  entryPages: MetricData[] | null; 
  exitPages: MetricData[] | null;
  topPages: ExpandedMetricData[] | null;
}) {
  const topEntries = Array.isArray(entryPages) ? entryPages.slice(0, 5) : [];
  const topExits = Array.isArray(exitPages) ? exitPages.slice(0, 5) : [];
  const safeTopPages = Array.isArray(topPages) ? topPages : [];
  const totalVisitors = safeTopPages.reduce((acc, curr) => acc + curr.visitors, 0);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm col-span-1 lg:col-span-3">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Map className="w-5 h-5 text-blue-500" />
        Fluxo de Navegação
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {/* Connector Lines (Desktop only) */}
        <div className="hidden md:block absolute top-[60px] left-[20%] w-[60%] h-0.5 bg-gradient-to-r from-emerald-200 via-blue-200 to-orange-200 -z-0" />

        {/* Entry */}
        <div className="bg-white border-2 border-emerald-50 rounded-xl p-4 z-10 hover:border-emerald-100 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-emerald-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Entrada
            </h4>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Top 5</span>
          </div>
          <div className="space-y-3">
            {topEntries.length > 0 ? topEntries.map((p, i) => (
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
        <div className="bg-white border-2 border-blue-50 rounded-xl p-4 z-10 hover:border-blue-100 transition-colors text-center flex flex-col justify-center min-h-[160px]">
          <h4 className="font-bold text-blue-900 mb-2">Engajamento Central</h4>
          <p className="text-4xl font-bold text-blue-600 mb-1">
            {totalVisitors.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Visitantes nos Principais Conteúdos</p>
        </div>

        {/* Exit */}
        <div className="bg-white border-2 border-orange-50 rounded-xl p-4 z-10 hover:border-orange-100 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-orange-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              Saída
            </h4>
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Top 5</span>
          </div>
          <div className="space-y-3">
            {topExits.length > 0 ? topExits.map((p, i) => (
              <div key={i} className="flex justify-between items-center text-sm group">
                <span className="truncate max-w-[150px] text-slate-600 font-medium group-hover:text-orange-700 transition-colors" title={p.x}>
                  {formatPagePath(p.x)}
                </span>
                <span className="font-bold text-slate-900">{p.y}</span>
              </div>
             )) : (
              <p className="text-sm text-slate-400 py-2">Sem dados de saída</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Page Performance Lists (Sticky vs Slippery)
function PagePerformanceLists({ pages }: { pages: ExpandedMetricData[] | null }) {
  if (!Array.isArray(pages)) return null; // Strict check

  // Sticky: High Time on Page (> 10s), Low Bounce (< 70%), sorted by Time
  const stickyPages = [...pages]
    .filter(p => p.visitors > 2 && (p.totaltime/p.visitors) > 10)
    .sort((a, b) => (b.totaltime/b.visitors) - (a.totaltime/a.visitors))
    .slice(0, 5);

  // Slippery: High Bounce (> 50%), sorted by Bounce Rate (desc)
  const slipperyPages = [...pages]
    .filter(p => p.visitors > 2 && (p.bounces/p.visitors) > 0.5)
    .sort((a, b) => (b.bounces/b.visitors) - (a.bounces/a.visitors))
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
                  <td className="px-3 py-3 font-medium text-slate-700 truncate max-w-[180px]" title={p.name}>
                    {formatPagePath(p.name)}
                  </td>
                  <td className="px-3 py-3 text-right text-emerald-600 font-bold">
                    {formatTime(p.totaltime/p.visitors)}
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
                  <td className="px-3 py-3 font-medium text-slate-700 truncate max-w-[180px]" title={p.name}>
                    {formatPagePath(p.name)}
                  </td>
                  <td className="px-3 py-3 text-right text-orange-600 font-bold">
                    {((p.bounces/p.visitors)*100).toFixed(0)}%
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

// 4. Traffic Trend (Chart)
function TrafficTrendCard({ data }: { data: MetricData[] | null }) {
  if (!Array.isArray(data) || data.length === 0) return null; // Strict array check

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
              tickFormatter={(val) => `${val}`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              labelFormatter={(label) => new Date(label).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
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

// 5. Heatmap Card
function HeatmapCard({ heatmap }: { heatmap: number[][] | null }) {
  if (!heatmap) return null; // Safety check

  // Find Peak Time
  let peakVal = 0;
  let peakDay = 0;
  let peakHour = 0;
  heatmap.forEach((d, di) => d.forEach((h, hi) => {
    if (h > peakVal) { peakVal = h; peakDay = di; peakHour = hi; }
  }));
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col h-full">
       <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-500" />
          Melhor Horário
        </h3>
        <p className="text-xs text-slate-500">Pico de atividade dos usuários</p>
      </div>

       <div className="flex-1 flex flex-col items-center justify-center p-6 bg-purple-50 rounded-xl border border-purple-100 mb-4">
        <p className="text-sm text-purple-600 uppercase tracking-widest font-bold mb-2">Momento de Ouro</p>
        <p className="text-4xl font-extrabold text-slate-900 mb-1">{days[peakDay]}</p>
        <p className="text-2xl font-medium text-slate-600">{peakHour}:00 - {peakHour+1}:00</p>
      </div>
      
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-600">
        <p>A maioria dos seus usuários acessa neste horário. Ótimo momento para lançar novidades.</p>
      </div>
    </div>
  );
}

// === Main Page ===
export default function ComportamentoPage() {
  const [data, setData] = useState<BehaviorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('7d');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/analytics/comportamento?period=${period}`);
      if (!res.ok) throw new Error('Falha ao carregar dados');
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  // Filter out admin pages
  const filterData = (result: BehaviorData | null) => {
    if (!result) return null;
    const filteredTopPages = result.topPagesExpanded.filter(p => isPublicPage(p.name));
    const filteredEntry = result.entryPages.filter(p => isPublicPage(p.x));
    const filteredExit = result.exitPages.filter(p => isPublicPage(p.x));
    
    return {
      ...result,
      topPagesExpanded: filteredTopPages,
      entryPages: filteredEntry,
      exitPages: filteredExit
    };
  };

  const processedData = filterData(data);

  // Derived Global Metrics
  const totalVisits = processedData?.topPagesExpanded.reduce((acc, curr) => acc + curr.visitors, 0) || 0;
  const totalTime = processedData?.topPagesExpanded.reduce((acc, curr) => acc + curr.totaltime, 0) || 0;
  const avgTimeGlobal = totalVisits > 0 ? totalTime / totalVisits : 0;
  
  // Avg Bounce
  const totalBounces = processedData?.topPagesExpanded.reduce((acc, curr) => acc + curr.bounces, 0) || 0;
  const avgBounceRate = totalVisits > 0 ? (totalBounces / totalVisits) * 100 : 0;

  // Most Active Page
  const topPage = processedData?.topPagesExpanded[0];

  if (loading && !processedData) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
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

      {processedData && (
        <>
          {/* 1. Global Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InsightCard 
              title="Tempo Médio Global" 
              value={formatTime(avgTimeGlobal)} 
              subtext="Média em todas as páginas" 
              icon={Timer}
              colorClass="text-blue-600"
              bgClass="bg-blue-50"
            />
            <InsightCard 
              title="Taxa de Rejeição Média" 
              value={`${avgBounceRate.toFixed(1)}%`} 
              subtext="Visitantes que saíram direto" 
              icon={ArrowUpRight}
              colorClass="text-orange-600"
              bgClass="bg-orange-50"
            />
             <InsightCard 
              title="Página Mais Popular" 
              value={topPage ? formatPagePath(topPage.name) : '-'} 
              subtext={`${topPage?.visitors || 0} visitantes únicos`} 
              icon={Zap}
              colorClass="text-purple-600"
              bgClass="bg-purple-50"
            />
          </div>

          {/* 2. Flow & Heatmap Row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <FlowCard 
              entryPages={processedData.entryPages}
              exitPages={processedData.exitPages}
              topPages={processedData.topPagesExpanded}
            />
            <div className="col-span-1 lg:col-span-1 h-full">
               <HeatmapCard heatmap={processedData.sessionsWeekly} />
            </div>
          </div>

          {/* 3. Detailed Performance Lists */}
          <PagePerformanceLists pages={processedData.topPagesExpanded} />

          {/* 4. Traffic Trend (Replaces Empty Events) */}
          <TrafficTrendCard data={processedData.pageviews} />
        </>
      )}
    </div>
  );
}
