'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  LogIn, 
  LogOut as LogOutIcon,
  MousePointerClick,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ArrowRight,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Eye,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import Link from 'next/link';

// Period options
const PERIODS = [
  { value: '24h', label: 'Últimas 24h' },
  { value: '7d', label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
  { value: '90d', label: 'Últimos 90 dias' },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

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

// Format page path for display
function formatPagePath(path: string): string {
  if (path === '/') return 'Página Inicial';
  if (path === '/admin/dashboard') return 'Admin Dashboard';
  if (path === '/login') return 'Login';
  if (path.startsWith('/botox')) return 'Botox para Bruxismo';
  if (path.startsWith('/placa')) return 'Placa Miorrelaxante';
  if (path.startsWith('/tratamento')) return 'Tratamento Bruxismo';
  if (path.startsWith('/blog')) return path.replace('/blog/', 'Blog: ') || 'Blog';
  if (path.startsWith('/contato')) return 'Contato';
  if (path.startsWith('/sobre')) return 'Sobre';
  return path;
}

// Format time from seconds
function formatTime(seconds: number): string {
  if (!seconds || seconds < 0) return '0s';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m ${Math.round(seconds % 60)}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.round((seconds % 3600) / 60)}m`;
}

// Insight Card Component
function InsightCard({ 
  title, 
  value, 
  subtitle,
  icon: Icon, 
  color,
  trend,
  tooltip
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  trend?: 'up' | 'down' | 'neutral';
  tooltip?: string;
}) {
  const colorClasses = {
    blue: { bg: 'bg-blue-50', icon: 'bg-blue-500', text: 'text-blue-700' },
    green: { bg: 'bg-emerald-50', icon: 'bg-emerald-500', text: 'text-emerald-700' },
    orange: { bg: 'bg-amber-50', icon: 'bg-amber-500', text: 'text-amber-700' },
    red: { bg: 'bg-red-50', icon: 'bg-red-500', text: 'text-red-700' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-500', text: 'text-purple-700' },
  };

  const colors = colorClasses[color];

  return (
    <div className={`${colors.bg} rounded-2xl p-5 relative group`} title={tooltip}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${colors.text} opacity-80`}>{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            {value}
            {trend && trend !== 'neutral' && (
              <span className={trend === 'up' ? 'text-emerald-500' : 'text-red-500'}>
                {trend === 'up' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
              </span>
            )}
          </p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl ${colors.icon} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      {tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
          {tooltip}
        </div>
      )}
    </div>
  );
}

// Actionable Insight Component
function ActionableInsight({ 
  type,
  title, 
  description, 
  action 
}: { 
  type: 'warning' | 'success' | 'tip';
  title: string; 
  description: string; 
  action?: string;
}) {
  const config = {
    warning: { 
      bg: 'bg-amber-50 border-amber-200', 
      icon: AlertTriangle, 
      iconColor: 'text-amber-500',
      titleColor: 'text-amber-800'
    },
    success: { 
      bg: 'bg-emerald-50 border-emerald-200', 
      icon: CheckCircle, 
      iconColor: 'text-emerald-500',
      titleColor: 'text-emerald-800'
    },
    tip: { 
      bg: 'bg-blue-50 border-blue-200', 
      icon: Lightbulb, 
      iconColor: 'text-blue-500',
      titleColor: 'text-blue-800'
    },
  };

  const { bg, icon: IconComponent, iconColor, titleColor } = config[type];

  return (
    <div className={`${bg} border rounded-xl p-4 flex gap-3`}>
      <IconComponent className={`w-5 h-5 ${iconColor} shrink-0 mt-0.5`} />
      <div>
        <p className={`font-semibold ${titleColor}`}>{title}</p>
        <p className="text-sm text-slate-600 mt-1">{description}</p>
        {action && (
          <p className="text-sm font-medium text-slate-700 mt-2 flex items-center gap-1">
            <span>💡</span> {action}
          </p>
        )}
      </div>
    </div>
  );
}

// Rich Data Table for Pages
function PagesTable({ 
  data, 
  exitPages 
}: { 
  data: ExpandedMetricData[]; 
  exitPages: MetricData[];
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <p className="text-sm text-slate-400 text-center py-8">Nenhum dado disponível</p>
      </div>
    );
  }

  // Create lookup for exit pages
  const exitLookup = exitPages.reduce((acc, page) => {
    acc[page.x] = page.y;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Performance das Páginas</h3>
          <p className="text-sm text-slate-500">Análise detalhada de cada página</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left py-3 px-2 text-xs font-semibold text-slate-500 uppercase">Página</th>
              <th className="text-right py-3 px-2 text-xs font-semibold text-slate-500 uppercase">Views</th>
              <th className="text-right py-3 px-2 text-xs font-semibold text-slate-500 uppercase">Visitantes</th>
              <th className="text-right py-3 px-2 text-xs font-semibold text-slate-500 uppercase">
                <span className="flex items-center justify-end gap-1" title="Porcentagem de visitantes que saíram na primeira página">
                  Rejeição
                  <span className="text-slate-300 cursor-help">ⓘ</span>
                </span>
              </th>
              <th className="text-right py-3 px-2 text-xs font-semibold text-slate-500 uppercase">
                <span className="flex items-center justify-end gap-1" title="Tempo médio que visitantes passam nesta página">
                  Tempo Médio
                  <span className="text-slate-300 cursor-help">ⓘ</span>
                </span>
              </th>
              <th className="text-center py-3 px-2 text-xs font-semibold text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 10).map((page, i) => {
              const bounceRate = page.visitors > 0 ? (page.bounces / page.visitors) * 100 : 0;
              const avgTime = page.visitors > 0 ? page.totaltime / page.visitors : 0;
              const exitCount = exitLookup[page.name] || 0;
              const isProblematic = bounceRate > 60 || (exitCount > page.visitors * 0.5);
              const isGood = bounceRate < 30 && avgTime > 60;

              return (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-2">
                    <span className="text-sm font-medium text-slate-700" title={page.name}>
                      {formatPagePath(page.name)}
                    </span>
                  </td>
                  <td className="text-right py-3 px-2">
                    <span className="text-sm font-semibold text-slate-900">
                      {page.pageviews.toLocaleString('pt-BR')}
                    </span>
                  </td>
                  <td className="text-right py-3 px-2">
                    <span className="text-sm text-slate-600">
                      {page.visitors.toLocaleString('pt-BR')}
                    </span>
                  </td>
                  <td className="text-right py-3 px-2">
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      bounceRate > 60 ? 'bg-red-100 text-red-700' :
                      bounceRate > 40 ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {bounceRate.toFixed(0)}%
                    </span>
                  </td>
                  <td className="text-right py-3 px-2">
                    <span className="text-sm text-slate-600">
                      {formatTime(avgTime)}
                    </span>
                  </td>
                  <td className="text-center py-3 px-2">
                    {isProblematic ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full" title="Esta página pode precisar de melhorias">
                        <AlertTriangle className="w-3 h-3" />
                        Revisar
                      </span>
                    ) : isGood ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full" title="Esta página tem bom engajamento">
                        <CheckCircle className="w-3 h-3" />
                        Bom
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Entry vs Exit Flow Component
function EntryExitFlow({ 
  entryPages, 
  exitPages 
}: { 
  entryPages: MetricData[]; 
  exitPages: MetricData[];
}) {
  const topEntries = entryPages.slice(0, 5);
  const topExits = exitPages.slice(0, 5);

  // Find pages that are both entry and exit (potential problems)
  const entrySet = new Set(entryPages.map(p => p.x));
  const problemPages = exitPages.filter(p => entrySet.has(p.x)).slice(0, 3);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-orange-500 text-white">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Fluxo de Navegação</h3>
          <p className="text-sm text-slate-500">De onde vêm e para onde vão seus visitantes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Entry Pages */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <LogIn className="w-4 h-4 text-emerald-500" />
            <h4 className="font-medium text-slate-700">Entram por</h4>
          </div>
          <div className="space-y-2">
            {topEntries.map((page, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-700 truncate flex-1" title={page.x}>
                  {formatPagePath(page.x)}
                </span>
                <span className="text-sm font-semibold text-emerald-700">{page.y}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow / Problem Indicator */}
        <div className="flex flex-col items-center justify-center">
          <ArrowRight className="w-8 h-8 text-slate-300 mb-4" />
          {problemPages.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
              <AlertTriangle className="w-5 h-5 text-amber-500 mx-auto mb-2" />
              <p className="text-xs font-medium text-amber-700">
                {problemPages.length} página{problemPages.length > 1 ? 's' : ''} com alto abandono
              </p>
              <p className="text-xs text-amber-600 mt-1">
                Visitantes entram e saem rapidamente
              </p>
            </div>
          )}
        </div>

        {/* Exit Pages */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <LogOutIcon className="w-4 h-4 text-orange-500" />
            <h4 className="font-medium text-slate-700">Saem de</h4>
          </div>
          <div className="space-y-2">
            {topExits.map((page, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-orange-50">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-700 truncate flex-1" title={page.x}>
                  {formatPagePath(page.x)}
                </span>
                <span className="text-sm font-semibold text-orange-700">{page.y}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Heatmap component for sessions by day/hour
const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function SessionsHeatmap({ data }: { data: number[][] }) {
  if (!data || data.length === 0) return null;
  
  const maxValue = Math.max(...data.flat().filter(v => v > 0), 1);
  
  // Find peak time
  let peakDay = 0, peakHour = 0, peakValue = 0;
  data.forEach((row, day) => {
    row.forEach((value, hour) => {
      if (value > peakValue) {
        peakValue = value;
        peakDay = day;
        peakHour = hour;
      }
    });
  });
  
  const getColor = (value: number) => {
    if (value === 0) return 'bg-slate-100';
    const intensity = value / maxValue;
    if (intensity < 0.25) return 'bg-blue-100';
    if (intensity < 0.5) return 'bg-blue-300';
    if (intensity < 0.75) return 'bg-blue-500';
    return 'bg-blue-700';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Melhor Horário para Publicar</h3>
            <p className="text-sm text-slate-500">Quando seus visitantes estão mais ativos</p>
          </div>
        </div>
        {peakValue > 0 && (
          <div className="bg-indigo-50 px-4 py-2 rounded-lg">
            <p className="text-xs text-indigo-600 font-medium">Pico de atividade</p>
            <p className="text-sm font-bold text-indigo-900">{DAYS[peakDay]} às {peakHour}h</p>
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Hours header */}
          <div className="flex gap-0.5 mb-1 pl-10">
            {Array.from({ length: 24 }, (_, i) => i).filter((_, i) => i % 3 === 0).map(h => (
              <div key={h} className="w-9 text-xs text-slate-400 text-center">
                {h}h
              </div>
            ))}
          </div>
          
          {/* Grid */}
          {data.map((row, dayIndex) => (
            <div key={dayIndex} className="flex gap-0.5 items-center mb-0.5">
              <div className="w-8 text-xs text-slate-500 font-medium">
                {DAYS[dayIndex]}
              </div>
              {row.map((value, hourIndex) => (
                <div
                  key={hourIndex}
                  className={`w-3 h-3 rounded-sm ${getColor(value)} transition-colors hover:ring-2 hover:ring-blue-400 cursor-pointer`}
                  title={`${DAYS[dayIndex]} ${hourIndex}h: ${value} sessões`}
                />
              ))}
            </div>
          ))}
          
          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">Menos atividade</span>
            <div className="flex gap-0.5">
              <div className="w-3 h-3 rounded-sm bg-slate-100" />
              <div className="w-3 h-3 rounded-sm bg-blue-100" />
              <div className="w-3 h-3 rounded-sm bg-blue-300" />
              <div className="w-3 h-3 rounded-sm bg-blue-500" />
              <div className="w-3 h-3 rounded-sm bg-blue-700" />
            </div>
            <span className="text-xs text-slate-500">Mais atividade</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Events chart
function EventsChart({ data, period }: { data: EventSeries[]; period: string }) {
  if (!data || data.length === 0) return null;

  const aggregated = data.reduce((acc, item) => {
    const key = item.t;
    if (!acc[key]) acc[key] = { date: key, count: 0 };
    acc[key].count += item.y;
    return acc;
  }, {} as Record<string, { date: string; count: number }>);

  const chartData = Object.values(aggregated).map(item => ({
    date: period === '24h' 
      ? new Date(item.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      : new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    Eventos: item.count,
  }));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600">
          <MousePointerClick className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Eventos ao Longo do Tempo</h3>
          <p className="text-sm text-slate-500">Cliques e interações rastreadas</p>
        </div>
      </div>
      
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={11} />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Area 
              type="monotone" 
              dataKey="Eventos" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              fill="url(#colorEvents)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

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
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Falha ao carregar dados');
      }
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

  // Filter out admin pages from analytics
  const isPublicPage = (path: string) => !path.startsWith('/admin') && !path.startsWith('/login');
  
  const publicPagesExpanded = data?.topPagesExpanded?.filter(p => isPublicPage(p.name)) || [];
  const publicEntryPages = data?.entryPages?.filter(p => isPublicPage(p.x)) || [];
  const publicExitPages = data?.exitPages?.filter(p => isPublicPage(p.x)) || [];

  // Calculate insights from PUBLIC pages only
  const totalViews = publicPagesExpanded.reduce((sum, p) => sum + (p.pageviews || 0), 0);
  const totalVisitors = publicPagesExpanded.reduce((sum, p) => sum + (p.visitors || 0), 0);
  const totalBounces = publicPagesExpanded.reduce((sum, p) => sum + (p.bounces || 0), 0);
  const totalTime = publicPagesExpanded.reduce((sum, p) => sum + (p.totaltime || 0), 0);
  
  // Safe calculations with guards against NaN/Infinity
  const avgBounceRate = totalVisitors > 0 ? Math.min((totalBounces / totalVisitors) * 100, 100) : 0;
  const avgTimeOnSite = totalVisitors > 0 ? Math.min(totalTime / totalVisitors, 86400) : 0; // Max 24h
  const pagesPerVisit = totalVisitors > 0 ? Math.min(totalViews / totalVisitors, 100) : 0; // Max 100 pages

  // Generate automatic insights
  const generateInsights = () => {
    const insights = [];
    
    if (avgBounceRate > 60) {
      insights.push({
        type: 'warning' as const,
        title: 'Taxa de rejeição alta',
        description: `${avgBounceRate.toFixed(0)}% dos visitantes saem sem interagir. Isso pode indicar que o conteúdo não está alinhado com as expectativas.`,
        action: 'Revise os títulos e primeiros parágrafos das páginas principais.'
      });
    } else if (avgBounceRate < 30) {
      insights.push({
        type: 'success' as const,
        title: 'Excelente engajamento',
        description: `Apenas ${avgBounceRate.toFixed(0)}% dos visitantes abandonam o site rapidamente. Seu conteúdo está engajando bem!`,
      });
    }

    if (avgTimeOnSite < 30) {
      insights.push({
        type: 'warning' as const,
        title: 'Tempo de permanência baixo',
        description: `Visitantes passam em média ${formatTime(avgTimeOnSite)} no site. Considere adicionar conteúdo mais envolvente.`,
        action: 'Adicione vídeos, imagens ou CTAs para manter visitantes engajados.'
      });
    }

    if (pagesPerVisit > 2) {
      insights.push({
        type: 'success' as const,
        title: 'Boa navegação interna',
        description: `Visitantes veem em média ${pagesPerVisit.toFixed(1)} páginas por visita. A estrutura de navegação está funcionando!`,
      });
    }

    return insights;
  };

  const insights = generateInsights();

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Comportamento</h1>
          <p className="text-slate-500 mt-1">Como os visitantes interagem com seu site</p>
        </div>
        <div className="bg-white rounded-2xl p-12 flex flex-col items-center justify-center">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-slate-500 mt-4">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Comportamento</h1>
          <p className="text-slate-500 mt-1">Como os visitantes interagem com seu site</p>
        </div>
        <div className="bg-white rounded-2xl p-12 flex flex-col items-center justify-center border-2 border-dashed border-red-200">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Erro ao carregar dados</h2>
          <p className="text-slate-500 text-center max-w-md mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link href="/admin/analytics" className="hover:text-blue-600">Análise de Tráfego</Link>
            <ArrowRight className="w-3 h-3" />
            <span className="text-slate-900 font-medium">Comportamento</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Comportamento do Usuário</h1>
          <p className="text-slate-500 mt-1">Entenda como visitantes navegam e interagem</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PERIODS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InsightCard
          title="Taxa de Rejeição"
          value={`${avgBounceRate.toFixed(0)}%`}
          subtitle={avgBounceRate > 50 ? 'Precisa de atenção' : 'Saudável'}
          icon={avgBounceRate > 50 ? TrendingDown : TrendingUp}
          color={avgBounceRate > 60 ? 'red' : avgBounceRate > 40 ? 'orange' : 'green'}
          tooltip="Porcentagem de visitantes que saem sem interagir com o site"
        />
        <InsightCard
          title="Tempo Médio"
          value={formatTime(avgTimeOnSite)}
          subtitle="por visita"
          icon={Clock}
          color={avgTimeOnSite > 60 ? 'green' : 'orange'}
          tooltip="Tempo médio que visitantes permanecem no site"
        />
        <InsightCard
          title="Páginas por Visita"
          value={pagesPerVisit.toFixed(1)}
          subtitle="navegação interna"
          icon={Eye}
          color={pagesPerVisit > 2 ? 'green' : 'blue'}
          tooltip="Número médio de páginas visualizadas por sessão"
        />
        <InsightCard
          title="Total de Views"
          value={totalViews.toLocaleString('pt-BR')}
          subtitle="no período"
          icon={Users}
          color="purple"
          tooltip="Total de visualizações de página no período selecionado"
        />
      </div>

      {/* Automatic Insights */}
      {insights.length > 0 && (
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <ActionableInsight key={i} {...insight} />
          ))}
        </div>
      )}

      {/* Pages Performance Table */}
      <PagesTable 
        data={publicPagesExpanded} 
        exitPages={publicExitPages}
      />

      {/* Entry/Exit Flow */}
      <EntryExitFlow 
        entryPages={publicEntryPages} 
        exitPages={publicExitPages}
      />

      {/* Heatmap and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SessionsHeatmap data={data?.sessionsWeekly || []} />
        <EventsChart data={data?.eventsSeries || []} period={period} />
      </div>
    </div>
  );
}
