'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  FileText, 
  LogIn, 
  LogOut as LogOutIcon,
  MousePointerClick,
  TrendingUp,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  Calendar,
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

// Data table component
function DataTable({ 
  title, 
  data, 
  icon: Icon, 
  iconColor = 'blue',
  formatLabel = (x: string) => x
}: { 
  title: string; 
  data: MetricData[]; 
  icon: React.ElementType;
  iconColor?: string;
  formatLabel?: (x: string) => string;
}) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-emerald-100 text-emerald-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2.5 rounded-xl ${colorMap[iconColor]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      
      <div className="space-y-3">
        {data.slice(0, 10).map((item, i) => {
          const maxValue = data[0]?.y || 1;
          const percentage = (item.y / maxValue) * 100;
          
          return (
            <div key={i} className="group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-700 truncate flex-1" title={item.x}>
                  {formatLabel(item.x) || '(direto)'}
                </span>
                <span className="text-sm font-semibold text-slate-900 ml-2">
                  {item.y.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
        {data.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">Nenhum dado disponível</p>
        )}
      </div>
    </div>
  );
}

// Heatmap component for sessions by day/hour
const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function SessionsHeatmap({ data }: { data: number[][] }) {
  if (!data || data.length === 0) return null;
  
  const maxValue = Math.max(...data.flat().filter(v => v > 0), 1);
  
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
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Atividade por Dia/Hora</h3>
          <p className="text-sm text-slate-500">Quando os visitantes acessam seu site</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Hours header */}
          <div className="flex gap-1 mb-1 pl-12">
            {HOURS.filter((_, i) => i % 3 === 0).map(h => (
              <div key={h} className="w-8 text-xs text-slate-400 text-center">
                {h}h
              </div>
            ))}
          </div>
          
          {/* Grid */}
          {data.map((row, dayIndex) => (
            <div key={dayIndex} className="flex gap-1 items-center mb-1">
              <div className="w-10 text-xs text-slate-500 font-medium">
                {DAYS[dayIndex]}
              </div>
              {row.map((value, hourIndex) => (
                <div
                  key={hourIndex}
                  className={`w-3 h-3 rounded-sm ${getColor(value)} transition-colors hover:ring-2 hover:ring-blue-400`}
                  title={`${DAYS[dayIndex]} ${hourIndex}h: ${value} sessões`}
                />
              ))}
            </div>
          ))}
          
          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">Menos</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-slate-100" />
              <div className="w-3 h-3 rounded-sm bg-blue-100" />
              <div className="w-3 h-3 rounded-sm bg-blue-300" />
              <div className="w-3 h-3 rounded-sm bg-blue-500" />
              <div className="w-3 h-3 rounded-sm bg-blue-700" />
            </div>
            <span className="text-xs text-slate-500">Mais</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Events over time chart
function EventsChart({ data, period }: { data: EventSeries[]; period: string }) {
  if (!data || data.length === 0) return null;

  // Aggregate events by timestamp
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
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Eventos ao Longo do Tempo</h3>
          <p className="text-sm text-slate-500">Interações rastreadas no período</p>
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

  // Prepare chart data
  const chartData = data?.topPages?.slice(0, 8).map((item, i) => ({
    name: formatPagePath(item.x),
    value: item.y,
    fill: COLORS[i % COLORS.length],
  })) || [];

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
          <p className="text-slate-500 mt-1">Entenda como visitantes navegam pelo seu site</p>
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

      {/* Top Pages Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Páginas Mais Visitadas</h2>
            <p className="text-sm text-slate-500">Ranking de páginas por visualizações</p>
          </div>
        </div>
        
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#94a3b8" 
                fontSize={12} 
                width={150}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value: any) => [Number(value).toLocaleString('pt-BR'), 'Visualizações']}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Entry and Exit Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable 
          title="Páginas de Entrada" 
          data={data?.entryPages || []}
          icon={LogIn}
          iconColor="green"
          formatLabel={formatPagePath}
        />
        <DataTable 
          title="Páginas de Saída" 
          data={data?.exitPages || []}
          icon={LogOutIcon}
          iconColor="orange"
          formatLabel={formatPagePath}
        />
      </div>

      {/* Heatmap and Events Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SessionsHeatmap data={data?.sessionsWeekly || []} />
        <EventsChart data={data?.eventsSeries || []} period={period} />
      </div>

      {/* Events */}
      <DataTable 
        title="Eventos Rastreados" 
        data={data?.events || []}
        icon={MousePointerClick}
        iconColor="purple"
      />
    </div>
  );
}
