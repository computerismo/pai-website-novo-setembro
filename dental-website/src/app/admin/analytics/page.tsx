'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Eye, 
  Clock, 
  TrendingUp, 
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  ArrowUpRight,
  RefreshCw,
  ExternalLink,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Types
interface UmamiStats {
  pageviews: number;
  visitors: number;
  visits: number;
  bounces: number;
  totaltime: number;
}

interface PageviewData {
  x: string;
  y: number;
}

interface MetricData {
  x: string;
  y: number;
}

interface AnalyticsData {
  stats: UmamiStats & {
    comparison: UmamiStats;
  };
  pageviews: {
    pageviews: PageviewData[];
    sessions: PageviewData[];
  };
  topPages: MetricData[];
  referrers: MetricData[];
  channels: MetricData[];
  devices: MetricData[];
  browsers: MetricData[];
  countries: MetricData[];
  activeVisitors: number;
  period: string;
}

// Colors for charts
const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// Period options
const PERIODS = [
  { value: '24h', label: 'Últimas 24h' },
  { value: '7d', label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
  { value: '90d', label: 'Últimos 90 dias' },
];

// Device icons
const deviceIcons: Record<string, React.ReactNode> = {
  desktop: <Monitor className="w-4 h-4" />,
  laptop: <Laptop className="w-4 h-4" />,
  mobile: <Smartphone className="w-4 h-4" />,
  tablet: <Tablet className="w-4 h-4" />,
};

// Format time from seconds to readable format
function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  return `${Math.round(seconds / 3600)}h ${Math.round((seconds % 3600) / 60)}m`;
}

// Format date for chart
function formatChartDate(dateString: string, period: string): string {
  const date = new Date(dateString);
  if (period === '24h') {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

// Stats Card Component with Trend
function StatsCard({ 
  title, 
  value, 
  previousValue,
  icon: Icon, 
  color = 'blue',
  suffix = ''
}: { 
  title: string; 
  value: string | number; 
  previousValue?: number;
  icon: React.ElementType;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  suffix?: string;
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  // Calculate trend
  let trend = 0;
  let trendDirection: 'up' | 'down' | 'neutral' = 'neutral';
  if (previousValue && previousValue > 0 && typeof value === 'number') {
    trend = ((value - previousValue) / previousValue) * 100;
    trendDirection = trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral';
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
            {suffix && <span className="text-lg font-normal text-slate-400 ml-1">{suffix}</span>}
          </p>
          {previousValue !== undefined && trendDirection !== 'neutral' && (
            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${
              trendDirection === 'up' ? 'text-emerald-600' : 'text-red-500'
            }`}>
              {trendDirection === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingUp className="w-4 h-4 rotate-180" />
              )}
              <span>{Math.abs(trend).toFixed(1)}%</span>
              <span className="text-slate-400 font-normal">vs anterior</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}


export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('7d');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/analytics?period=${period}`);
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
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [period]);

  // Format chart data
  const chartData = data?.pageviews?.pageviews?.map((pv, i) => ({
    date: formatChartDate(pv.x, period),
    pageviews: pv.y,
    sessions: data.pageviews.sessions[i]?.y || 0,
  })) || [];

  // Calculate bounce rate
  const bounceRate = data?.stats ? Math.round((data.stats.bounces / data.stats.visits) * 100) : 0;
  const prevBounceRate = data?.stats?.comparison ? Math.round((data.stats.comparison.bounces / data.stats.comparison.visits) * 100) : undefined;

  // Calculate avg time
  const avgTime = data?.stats ? data.stats.totaltime / data.stats.visits : 0;

  // Device chart data
  const deviceData = data?.devices?.map((d, i) => ({
    name: d.x,
    value: d.y,
    color: CHART_COLORS[i % CHART_COLORS.length],
  })) || [];

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Análise de Tráfego</h1>
          <p className="text-slate-500 mt-1">Métricas e insights do site via Umami Analytics</p>
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
          <h1 className="text-2xl font-bold text-slate-900">Análise de Tráfego</h1>
          <p className="text-slate-500 mt-1">Métricas e insights do site via Umami Analytics</p>
        </div>
        <div className="bg-white rounded-2xl p-12 flex flex-col items-center justify-center border-2 border-dashed border-red-200">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-red-500" />
          </div>
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
          <h1 className="text-2xl font-bold text-slate-900">Análise de Tráfego</h1>
          <p className="text-slate-500 mt-1">Métricas e insights do site via Umami Analytics</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Active visitors badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-emerald-700">
              {data?.activeVisitors || 0} online agora
            </span>
          </div>

          {/* Period selector */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PERIODS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>

          {/* Refresh button */}
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Link to Umami */}
          <a
            href={process.env.NEXT_PUBLIC_UMAMI_URL || 'https://umami-production-4051.up.railway.app'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            title="Abrir Umami Dashboard"
          >
            <ExternalLink className="w-5 h-5 text-slate-600" />
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Visitantes Únicos"
          value={data?.stats?.visitors || 0}
          previousValue={data?.stats?.comparison?.visitors}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Visualizações"
          value={data?.stats?.pageviews || 0}
          previousValue={data?.stats?.comparison?.pageviews}
          icon={Eye}
          color="green"
        />
        <StatsCard
          title="Taxa de Rejeição"
          value={bounceRate}
          previousValue={prevBounceRate}
          suffix="%"
          icon={TrendingUp}
          color="orange"
        />
        <StatsCard
          title="Tempo Médio"
          value={formatTime(avgTime)}
          icon={Clock}
          color="purple"
        />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Tráfego ao longo do tempo</h2>
            <p className="text-sm text-slate-500">Visualizações e sessões</p>
          </div>
        </div>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#94a3b8" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dx={-10}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Bar
                dataKey="pageviews"
                name="Visualizações"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="sessions"
                name="Sessões"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom section: Pages, Referrers, Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-slate-900">Páginas Mais Visitadas</h3>
          </div>
          <div className="space-y-3">
            {data?.topPages
              ?.filter(page => {
                 const x = page.x;
                 const validRoutes = [
                   '/', '/sobre', '/contato', '/blog', '/tratamento-bruxismo',
                   '/placa-miorrelaxante', '/botox-bruxismo', '/login'
                 ];
                 const isValid = validRoutes.includes(x) || x.startsWith('/blog/') || x.startsWith('/admin'); // Admin filtered next
                 return !x.startsWith('/admin') && !x.startsWith('/login') && isValid;
              })
              .slice(0, 5) // Reduced to 5 to fit better with card style
              .map((page, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-100 border border-slate-200 hover:border-blue-300 transition-colors group">
                <span className="text-sm font-medium text-slate-700 truncate max-w-[70%]" title={page.x}>
                  {page.x === '/' ? 'Página Inicial' : page.x}
                </span>
                <span className="px-2 py-1 bg-white rounded-md text-xs font-bold text-blue-600 shadow-sm border border-slate-100 group-hover:border-blue-100">
                  {page.y.toLocaleString('pt-BR')}
                </span>
              </div>
            ))}
            {(!data?.topPages || data.topPages.filter(page => !page.x.startsWith('/admin') && !page.x.startsWith('/login')).length === 0) && (
              <p className="text-sm text-slate-400 text-center py-4">Nenhum dado disponível</p>
            )}
          </div>
        </div>

        {/* Traffic Channels */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-slate-900">Fontes de Tráfego</h3>
          </div>
          <div className="space-y-3">
            {(() => {
              // Fallback logic: If no channels data but we have visitors, assume it's Direct traffic
              let displayChannels = data?.channels || [];
              if (displayChannels.length === 0 && (data?.stats?.visitors || 0) > 0) {
                displayChannels = [{ x: 'Direct', y: data?.stats?.visitors || 0 }];
              }

              return displayChannels.slice(0, 5).map((channel, i) => { // Reduced to 5
                const channelNames: Record<string, string> = {
                  'Direct': 'Direto',
                  'Organic': 'Orgânico',
                  'Referral': 'Referência',
                  'Social': 'Redes Sociais',
                  'Email': 'Email',
                  'Paid': 'Pago',
                };
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-100 border border-slate-200 hover:border-emerald-300 transition-colors group">
                    <span className="text-sm font-medium text-slate-700 capitalize truncate flex-1">
                      {channelNames[channel.x] || channel.x}
                    </span>
                    <span className="px-2 py-1 bg-white rounded-md text-xs font-bold text-emerald-600 shadow-sm border border-slate-100 group-hover:border-emerald-100">
                      {channel.y.toLocaleString('pt-BR')}
                    </span>
                  </div>
                );
              });
            })()}
            {(!data?.channels || (data.channels.length === 0 && (!data?.stats?.visitors || data.stats.visitors === 0))) && (
              <p className="text-sm text-slate-400 text-center py-4">Nenhum dado disponível</p>
            )}
          </div>
        </div>

        {/* Devices */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold text-slate-900">Dispositivos</h3>
          </div>
          
          {deviceData.length > 0 ? (
            <div className="flex items-center justify-center">
              <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="ml-4 space-y-2">
                {deviceData.map((device, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: device.color }}
                    />
                    <span className="text-sm text-slate-600 capitalize flex items-center gap-1">
                      {/* Use Monitor icon for both to be consistent with 'Computador' label */}
                      {(device.name.toLowerCase() === 'laptop' || device.name.toLowerCase() === 'desktop') 
                        ? <Monitor className="w-4 h-4" /> 
                        : (deviceIcons[device.name.toLowerCase()] || <Monitor className="w-4 h-4" />)
                      }
                      {(() => {
                        const name = device.name.toLowerCase();
                        if (name === 'desktop' || name === 'laptop') return 'Computador';
                        if (name === 'mobile') return 'Móvel';
                        return device.name;
                      })()}
                    </span>
                    <span className="text-sm font-medium text-slate-900">
                      {device.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">Nenhum dado disponível</p>
          )}
        </div>
      </div>
    </div>
  );
}
