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
  RefreshCw,
  Activity,
  Info
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
  Legend,
  LabelList,
} from 'recharts';
import { getAllAnalyticsData, type StatsResponse, type MetricItem, type TopPageItem } from '@/lib/analytics/ga4-api';

// Types for our unified data structure
interface AnalyticsData {
  stats: StatsResponse;
  pageviews: {
    pageviews: { x: string; y: number }[];
    sessions: { x: string; y: number }[];
  };
  topPages: TopPageItem[];
  devices: MetricItem[];
  channels: Array<{ x: string; y: number; users: number }>;
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

// Stats Card Component with Trend and Info Tooltip
function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue',
  suffix = '',
  tooltip
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  suffix?: string;
  tooltip?: string;
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
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            {tooltip && (
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-slate-400 cursor-help hover:text-blue-500 transition-colors" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-48 text-center z-50 shadow-lg">
                  {tooltip}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-slate-800" />
                </div>
              </div>
            )}
          </div>
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
      const result = await getAllAnalyticsData(period);
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
          <p className="text-slate-500 mt-1">Métricas e insights do site via Google Analytics</p>
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
          <p className="text-slate-500 mt-1">Métricas e insights do site via Google Analytics</p>
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
          <p className="text-slate-500 mt-1">Métricas e insights do site via Google Analytics</p>
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
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Visitantes Únicos"
          value={data?.stats?.visitors || 0}
          icon={Users}
          color="blue"
          tooltip="Número de pessoas diferentes que visitaram seu site no período selecionado."
        />
        <StatsCard
          title="Visualizações"
          value={data?.stats?.pageviews || 0}
          icon={Eye}
          color="green"
          tooltip="Total de páginas visualizadas. Inclui visitas repetidas à mesma página."
        />
        <StatsCard
          title="Taxa de Rejeição"
          value={Math.round(data?.stats?.bounceRate || 0)}
          suffix="%"
          icon={TrendingUp}
          color="orange"
          tooltip="Porcentagem de visitantes que saíram sem interagir. Menor é melhor."
        />
        <StatsCard
          title="Tempo Médio"
          value={formatTime(data?.stats?.avgSessionDuration || 0)}
          icon={Clock}
          color="purple"
          tooltip="Duração média que os visitantes passam no seu site por sessão."
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
              {/* Custom Legend with tooltips */}
              <Legend 
                verticalAlign="top" 
                height={36}
                content={() => (
                  <div className="flex items-center justify-start gap-6 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-sm text-slate-600">Visualizações</span>
                      <div className="relative group">
                        <Info className="w-3.5 h-3.5 text-slate-400 cursor-help hover:text-blue-500 transition-colors" />
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-48 text-center z-50 shadow-lg">
                          Total de páginas carregadas. Cada vez que alguém abre uma página conta como 1.
                          <div className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-slate-800" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-sm text-slate-600">Sessões</span>
                      <div className="relative group">
                        <Info className="w-3.5 h-3.5 text-slate-400 cursor-help hover:text-emerald-500 transition-colors" />
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-48 text-center z-50 shadow-lg">
                          Períodos de atividade no site. Uma sessão pode ter várias visualizações.
                          <div className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-slate-800" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              />
              <Bar
                dataKey="pageviews"
                name="Visualizações"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                barSize={20}
              >
                <LabelList dataKey="pageviews" position="top" fontSize={11} fill="#334155" fontWeight={600} />
              </Bar>
              <Bar
                dataKey="sessions"
                name="Sessões"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                barSize={20}
              >
                <LabelList dataKey="sessions" position="top" fontSize={11} fill="#334155" fontWeight={600} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom section: Pages, Channels, Devices */}
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
                 return !x.startsWith('/admin') && !x.startsWith('/login');
              })
              .slice(0, 5)
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
            {(!data?.topPages || data.topPages.length === 0) && (
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
            {data?.channels?.slice(0, 5).map((channel, i) => {
              const channelInfo: Record<string, { name: string; tooltip: string }> = {
                'Direct': { 
                  name: 'Direto', 
                  tooltip: 'Visitantes que digitaram seu site diretamente no navegador' 
                },
                'Organic Search': { 
                  name: 'Busca Orgânica', 
                  tooltip: 'Visitantes vindos de buscas no Google, Bing, etc.' 
                },
                'Referral': { 
                  name: 'Referência', 
                  tooltip: 'Visitantes vindos de links em outros sites' 
                },
                'Organic Social': { 
                  name: 'Redes Sociais', 
                  tooltip: 'Visitantes vindos de posts não pagos em redes sociais' 
                },
                'Email': { 
                  name: 'Email', 
                  tooltip: 'Visitantes vindos de campanhas de email marketing' 
                },
                'Paid Search': { 
                  name: 'Busca Paga', 
                  tooltip: 'Visitantes vindos de anúncios pagos no Google Ads' 
                },
                'Unassigned': { 
                  name: 'Desconhecido', 
                  tooltip: 'Tráfego que não pôde ser categorizado (falta UTM ou referência bloqueada)' 
                },
                'Paid Social': { 
                  name: 'Redes Sociais Pagas', 
                  tooltip: 'Visitantes vindos de anúncios pagos em redes sociais' 
                },
              };
              const info = channelInfo[channel.x] || { name: channel.x, tooltip: 'Fonte de tráfego' };
              return (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-100 border border-slate-200 hover:border-emerald-300 transition-colors group">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span className="text-sm font-medium text-slate-700 truncate">
                      {info.name}
                    </span>
                    <div className="relative group/tooltip">
                      <Info className="w-3.5 h-3.5 text-slate-400 cursor-help hover:text-emerald-500 transition-colors shrink-0" />
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 w-48 text-center z-50 shadow-lg">
                        {info.tooltip}
                        <div className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-slate-800" />
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-white rounded-md text-xs font-bold text-emerald-600 shadow-sm border border-slate-100 group-hover:border-emerald-100">
                    {channel.y.toLocaleString('pt-BR')}
                  </span>
                </div>
              );
            })}
            {(!data?.channels || data.channels.length === 0) && (
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
            <div className="space-y-4">
              {deviceData.map((device, i) => {
                const total = deviceData.reduce((acc, d) => acc + d.value, 0);
                const percentage = total > 0 ? (device.value / total) * 100 : 0;
                const label = device.name === 'desktop' ? 'Computador' : device.name === 'mobile' ? 'Móvel' : device.name === 'tablet' ? 'Tablet' : device.name;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: device.color }}
                        >
                          {deviceIcons[device.name.toLowerCase()] || <Monitor className="w-4 h-4" />}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{percentage.toFixed(0)}%</span>
                        <span className="text-sm font-bold text-slate-900">{device.value}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%`, backgroundColor: device.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">Nenhum dado disponível</p>
          )}
        </div>
      </div>
    </div>
  );
}
