'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowRight,
  RefreshCw,
  Map,
  Zap,
  Target,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  MousePointerClick,
  Filter
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
  ComposedChart,
  Line
} from 'recharts';
import Link from 'next/link';

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
  if (path === '/admin/dashboard') return 'Admin';
  if (path === '/login') return 'Login';
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

// === View Components ===

// 1. Journey View (Jornada)
function JourneyView({ 
  entryPages, 
  exitPages,
  topPages 
}: { 
  entryPages: MetricData[]; 
  exitPages: MetricData[];
  topPages: ExpandedMetricData[];
}) {
  const topEntries = entryPages.slice(0, 5);
  const topExits = exitPages.slice(0, 5);

  // Find "Revolving Doors" (High bounce rate entries)
  const revolvingDoors = topPages
    .filter(p => p.visitors > 5 && (p.bounces / p.visitors) > 0.7)
    .sort((a, b) => b.visitors - a.visitors)
    .slice(0, 3);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Map className="w-5 h-5 text-blue-500" />
          Fluxo de Navegação
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Lines (Desktop only) */}
          <div className="hidden md:block absolute top-1/2 left-1/4 w-1/2 h-0.5 bg-gradient-to-r from-emerald-200 via-blue-200 to-orange-200 -z-10" />

          {/* Entry */}
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
            <h4 className="font-semibold text-emerald-800 mb-3 flex items-center justify-between">
              <span>Portas de Entrada</span>
              <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full">Início</span>
            </h4>
            <div className="space-y-2">
              {topEntries.map((p, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="truncate max-w-[120px] text-emerald-900" title={p.x}>{formatPagePath(p.x)}</span>
                  <span className="font-bold text-emerald-700">{p.y}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Core Content */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 z-10">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center justify-between">
              <span>Conteúdo Principal</span>
              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">Meio</span>
            </h4>
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-blue-600 mb-1">
                {topPages.reduce((acc, curr) => acc + curr.visitors, 0).toLocaleString()}
              </p>
              <p className="text-xs text-blue-800 uppercase tracking-wide">Visitantes Totais</p>
              <p className="text-xs text-blue-600 mt-2">Navegando por {topPages.length} páginas</p>
            </div>
          </div>

          {/* Exit */}
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
            <h4 className="font-semibold text-orange-800 mb-3 flex items-center justify-between">
              <span>Pontos de Saída</span>
              <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full">Fim</span>
            </h4>
            <div className="space-y-2">
              {topExits.map((p, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="truncate max-w-[120px] text-orange-900" title={p.x}>{formatPagePath(p.x)}</span>
                  <span className="font-bold text-orange-700">{p.y}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Revolving Doors Alert */}
      {revolvingDoors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-4">
          <div className="p-2 bg-red-100 rounded-lg shrink-0">
            <Filter className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h4 className="font-bold text-red-900">Páginas "Porta Giratória"</h4>
            <p className="text-sm text-red-700 mt-1 mb-2">
              Estas páginas têm alto tráfego de entrada mas &gt;70% de taxa de rejeição. Visitantes entram e saem imediatamente.
            </p>
            <div className="flex flex-wrap gap-2">
              {revolvingDoors.map(p => (
                <span key={p.name} className="px-2 py-1 bg-white border border-red-100 rounded text-xs font-medium text-red-600">
                  {formatPagePath(p.name)} ({(p.bounces/p.visitors*100).toFixed(0)}% rejeição)
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 2. Engagement View (Engajamento)
function EngagementView({ 
  pages,
  heatmap 
}: { 
  pages: ExpandedMetricData[];
  heatmap: number[][]; // 7 days x 24 hours
}) {
  // Scatter Data: Views vs Time
  const scatterData = pages.map(p => ({
    x: p.pageviews, // Views
    y: Math.min(p.visitors > 0 ? p.totaltime / p.visitors : 0, 300), // Avg time (capped at 5m for viz)
    z: p.bounces / p.visitors, // Bounce rate (for color/size context if needed)
    name: formatPagePath(p.name),
    fullPath: p.name
  })).filter(p => p.x > 5); // Filter noise

  // Find Peak Time
  let peakVal = 0;
  let peakDay = 0;
  let peakHour = 0;
  heatmap.forEach((d, di) => d.forEach((h, hi) => {
    if (h > peakVal) { peakVal = h; peakDay = di; peakHour = hi; }
  }));
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scatter Plot - Quality of Variance */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-500" />
              Qualidade do Conteúdo
            </h3>
            <p className="text-xs text-slate-500">Visualizações vs. Tempo Médio (Páginas com &gt;5 views)</p>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                <XAxis type="number" dataKey="x" name="Views" stroke={COLORS.neutral} fontSize={10} tickFormatter={(v) => `${v}`} />
                <YAxis type="number" dataKey="y" name="Tempo (s)" stroke={COLORS.neutral} fontSize={10} tickFormatter={(v) => `${v}s`} />
                <ReferenceLine y={60} stroke={COLORS.success} strokeDasharray="3 3" label={{ value: 'Engajado (>60s)', position: 'insideTopRight', fill: COLORS.success, fontSize: 10 }} />
                <Scatter name="Páginas" data={scatterData} fill={COLORS.accent}>
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.y > 60 ? COLORS.success : entry.y < 10 ? COLORS.danger : COLORS.accent} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-2 px-2">
            <span>Pouco tempo, Baixo interesse</span>
            <span>Muito tempo, Alto engajamento</span>
          </div>
        </div>

        {/* Heatmap Insights */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Melhor Horário
            </h3>
            <p className="text-xs text-slate-500">Quando seus usuários estão mais ativos</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg border border-slate-100 mb-4">
            <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold mb-2">Pico de Acesso</p>
            <p className="text-4xl font-bold text-blue-600 mb-1">{days[peakDay]}</p>
            <p className="text-2xl font-medium text-slate-700">{peakHour}:00 - {peakHour+1}:00</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-slate-800">Dica de Ação:</h4>
            <div className="flex gap-2 items-start text-sm text-slate-600 bg-blue-50 p-3 rounded-lg">
              <Zap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p>Agende seus novos posts ou campanhas para <strong>{days[peakDay]}s</strong> pouco antes das <strong>{peakHour}h</strong> para maximizar o alcance inicial.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Conversion View (Conversão)
function ConversionView({ 
  eventSeries,
  events 
}: { 
  eventSeries: EventSeries[];
  events: MetricData[];
}) {
  // Process series data (assuming granularity matches)
  const chartData = eventSeries.reduce((acc, curr) => {
    const existing = acc.find(a => a.x === curr.t);
    if (existing) {
      existing.y += curr.y;
    } else {
      acc.push({ x: curr.t, y: curr.y });
    }
    return acc;
  }, [] as { x: string; y: number }[]).sort((a,b) => new Date(a.x).getTime() - new Date(b.x).getTime());

  const totalEvents = events.reduce((sum, e) => sum + e.y, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-red-500" />
            Funil de Eventos
          </h3>
          <span className="text-2xl font-bold text-slate-900">{totalEvents} <span className="text-sm font-normal text-slate-500">interações totais</span></span>
        </div>

        {/* Timeline */}
        <div className="h-[250px] mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
              <XAxis 
                dataKey="x" 
                stroke={COLORS.neutral} 
                fontSize={10} 
                tickFormatter={(val) => new Date(val).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
              />
              <YAxis stroke={COLORS.neutral} fontSize={10} />
              <Area type="monotone" dataKey="y" stroke={COLORS.primary} strokeWidth={3} fill="url(#colorEvents)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Events List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.slice(0, 6).map((e, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors bg-slate-50">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-600 shadow-sm">
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900 truncate" title={e.x}>{e.x}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(e.y / events[0].y) * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold text-blue-700">{e.y}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// === Main Page Component ===
export default function ComportamentoPage() {
  const [data, setData] = useState<BehaviorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('7d');
  const [view, setView] = useState<'journey' | 'engagement' | 'conversion'>('journey');

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

  // --- Filter Data (The "Save the Day" fix) ---
  // Exclude admin, login, and dashboard pages from ALL analytics
  const filterData = (result: BehaviorData | null) => {
    if (!result) return null;

    const filteredTopPages = result.topPagesExpanded.filter(p => isPublicPage(p.name));
    const filteredEntry = result.entryPages.filter(p => isPublicPage(p.x));
    const filteredExit = result.exitPages.filter(p => isPublicPage(p.x));
    
    // Note: Events and Sessions usually don't have paths attached directly in this payload format 
    // unless granular, but topPages is the main culprit for "admin views".
    
    return {
      ...result,
      topPagesExpanded: filteredTopPages,
      entryPages: filteredEntry,
      exitPages: filteredExit
    };
  };

  const processedData = filterData(data);

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
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Comportamento</h1>
          <p className="text-slate-500">Entenda a jornada e o engajamento real.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                period === p.value 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
        <button
          onClick={() => setView('journey')}
          className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
            view === 'journey' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Map className="w-4 h-4" />
          <span className="hidden sm:inline">Jornada</span>
        </button>
        <button
          onClick={() => setView('engagement')}
          className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
            view === 'engagement' 
              ? 'bg-white text-purple-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span className="hidden sm:inline">Engajamento</span>
        </button>
        <button
          onClick={() => setView('conversion')}
          className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
            view === 'conversion' 
              ? 'bg-white text-emerald-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Target className="w-4 h-4" />
          <span className="hidden sm:inline">Conversão</span>
        </button>
      </div>

      {/* Views Content */}
      <div className="min-h-[500px]">
        {processedData && (
          <>
            {view === 'journey' && (
              <JourneyView 
                entryPages={processedData.entryPages}
                exitPages={processedData.exitPages}
                topPages={processedData.topPagesExpanded}
              />
            )}
            
            {view === 'engagement' && (
              <EngagementView 
                pages={processedData.topPagesExpanded}
                heatmap={processedData.sessionsWeekly}
              />
            )}

            {view === 'conversion' && (
              <ConversionView 
                eventSeries={processedData.eventsSeries}
                events={processedData.events}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
