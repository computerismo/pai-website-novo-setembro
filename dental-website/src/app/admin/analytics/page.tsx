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
  ArrowUpRight,
  RefreshCw,
  ExternalLink,
  Activity
} from 'lucide-react';
import {
  AreaChart,
  Area,
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
  stats: UmamiStats;
  pageviews: {
    pageviews: PageviewData[];
    sessions: PageviewData[];
  };
  topPages: MetricData[];
  referrers: MetricData[];
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

// Stats Card Component
function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue',
  suffix = ''
}: { 
  title: string; 
  value: string | number; 
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

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
            {suffix && <span className="text-lg font-normal text-slate-400 ml-1">{suffix}</span>}
          </p>
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
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Visualizações"
          value={data?.stats?.pageviews || 0}
          icon={Eye}
          color="green"
        />
        <StatsCard
          title="Taxa de Rejeição"
          value={bounceRate}
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
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                stroke="#94a3b8" 
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
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
                dataKey="pageviews"
                name="Visualizações"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorPageviews)"
              />
              <Area
                type="monotone"
                dataKey="sessions"
                name="Sessões"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#colorSessions)"
              />
            </AreaChart>
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
            {data?.topPages?.slice(0, 7).map((page, i) => (
              <div key={i} className="flex items-center justify-between group">
                <span className="text-sm text-slate-600 truncate flex-1" title={page.x}>
                  {page.x === '/' ? 'Página Inicial' : page.x}
                </span>
                <span className="text-sm font-medium text-slate-900 ml-2">
                  {page.y.toLocaleString('pt-BR')}
                </span>
              </div>
            ))}
            {(!data?.topPages || data.topPages.length === 0) && (
              <p className="text-sm text-slate-400 text-center py-4">Nenhum dado disponível</p>
            )}
          </div>
        </div>

        {/* Referrers */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-slate-900">Fontes de Tráfego</h3>
          </div>
          <div className="space-y-3">
            {data?.referrers?.slice(0, 7).map((ref, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-slate-600 truncate flex-1" title={ref.x}>
                  {ref.x || 'Direto'}
                </span>
                <span className="text-sm font-medium text-slate-900 ml-2">
                  {ref.y.toLocaleString('pt-BR')}
                </span>
              </div>
            ))}
            {(!data?.referrers || data.referrers.length === 0) && (
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
                      {deviceIcons[device.name.toLowerCase()] || null}
                      {device.name}
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
