'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Activity,
  Users,
  Eye,
  Globe,
  RefreshCw,
  ArrowRight,
  Zap,
  Radio,
  MapPin,
  Monitor,
  Smartphone,
  Tablet,
  MousePointer,
} from 'lucide-react';
import Link from 'next/link';
import ReactCountryFlag from 'react-country-flag';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { getRealtime, type RealtimeResponse, type RealtimeCityItem } from '@/lib/analytics/ga4-api';

// Country code mapping for flags
const countryToCode: Record<string, string> = {
  'Brazil': 'BR', 'United States': 'US', 'Canada': 'CA', 'Mexico': 'MX',
  'Argentina': 'AR', 'Chile': 'CL', 'Colombia': 'CO', 'Peru': 'PE',
  'Portugal': 'PT', 'Spain': 'ES', 'France': 'FR', 'Germany': 'DE',
  'Italy': 'IT', 'United Kingdom': 'GB', 'Poland': 'PL', 'Japan': 'JP',
  'Australia': 'AU', 'India': 'IN', 'China': 'CN',
};

function getCountryCode(country: string): string | null {
  if (!country || country === '(not set)') return null;
  return countryToCode[country] || null;
}

// Format page path
function formatPagePath(path: string): string {
  if (path === '/' || path === 'Home' || path === 'Página Inicial') return 'Página Inicial';
  if (path.includes('Botox')) return 'Botox para Bruxismo';
  if (path.includes('Placa')) return 'Placa Miorrelaxante';
  if (path.includes('Tratamento')) return 'Tratamento Bruxismo';
  if (path.includes('Blog')) return path.replace('/blog/', 'Blog: ') || 'Blog';
  if (path.includes('Contato')) return 'Contato';
  if (path.includes('Sobre')) return 'Sobre';
  return path;
}

// Device icons
const deviceIcons: Record<string, React.ReactNode> = {
  desktop: <Monitor className="w-5 h-5" />,
  mobile: <Smartphone className="w-5 h-5" />,
  tablet: <Tablet className="w-5 h-5" />,
};

// Stats card
function RealtimeStatCard({ 
  title, value, icon: Icon, color, pulse = false
}: { 
  title: string; 
  value: number; 
  icon: React.ElementType;
  color: string;
  pulse?: boolean;
}) {
  const colorClasses: Record<string, { bg: string; icon: string; text: string }> = {
    green: { bg: 'bg-emerald-50', icon: 'bg-emerald-500', text: 'text-emerald-600' },
    blue: { bg: 'bg-blue-50', icon: 'bg-blue-500', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-500', text: 'text-purple-600' },
    orange: { bg: 'bg-orange-50', icon: 'bg-orange-500', text: 'text-orange-600' },
  };
  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`${colors.bg} rounded-2xl p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${colors.text}`}>{title}</p>
          <p className="text-4xl font-bold text-slate-900 mt-2">{value.toLocaleString('pt-BR')}</p>
        </div>
        <div className={`w-14 h-14 rounded-2xl ${colors.icon} flex items-center justify-center relative`}>
          <Icon className="w-7 h-7 text-white" />
          {pulse && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />}
        </div>
      </div>
    </div>
  );
}

// Live indicator
function LiveIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full border border-red-100">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
      </span>
      <span className="text-sm font-semibold text-red-600">AO VIVO</span>
    </div>
  );
}

// Timestamp display
function LastUpdate({ timestamp }: { timestamp: string }) {
  const [timeAgo, setTimeAgo] = useState('');
  
  useEffect(() => {
    if (!timestamp) return;
    const date = new Date(timestamp);
    setTimeAgo(date.toLocaleTimeString('pt-BR'));
  }, [timestamp]);

  return (
    <div className="px-4 py-2 bg-slate-100 rounded-full">
      <span className="text-sm text-slate-600">Lesti: {timeAgo}</span>
    </div>
  );
}

// 30-minute trend chart
function ActivityTrendChart({ data }: { data: Array<{ minutesAgo: number; users: number }> }) {
  // Fill gaps and reverse for correct display (0 = now on the right)
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const found = data.find(d => d.minutesAgo === i);
    return { minute: 30 - i, users: found?.users || 0 };
  }).reverse();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Atividade em Tempo Real</h3>
          <p className="text-sm text-slate-500">Últimos 30 minutos</p>
        </div>
      </div>
      <div className="h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="minute" hide />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(value) => [`${value ?? 0} usuários`, 'Ativos']}
              labelFormatter={(label) => `${label} min atrás`}
            />
            <Area 
              type="monotone" 
              dataKey="users" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fill="url(#colorUsers)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Active pages card
function ActivePagesCard({ pages }: { pages: Record<string, number> }) {
  const sortedPages = Object.entries(pages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
          <Eye className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Páginas Ativas</h3>
          <p className="text-sm text-slate-500">Sendo visualizadas agora</p>
        </div>
      </div>
      <div className="space-y-3">
        {sortedPages.map(([page, users], i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                {users}
              </span>
              <span className="text-sm text-slate-700">{formatPagePath(page)}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300" />
          </div>
        ))}
        {sortedPages.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">Nenhuma página ativa</p>
        )}
      </div>
    </div>
  );
}

// Cities card (NEW)
function CitiesCard({ cities }: { cities: RealtimeCityItem[] }) {
  const sortedCities = cities.sort((a, b) => b.users - a.users).slice(0, 6);
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Visitantes por Cidade</h3>
          <p className="text-sm text-slate-500">Localização em tempo real</p>
        </div>
      </div>
      <div className="space-y-3">
        {sortedCities.map((item, i) => {
          const code = getCountryCode(item.country);
          return (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3">
                {code ? (
                  <ReactCountryFlag countryCode={code} svg style={{ width: '1.2em', height: '1.2em' }} />
                ) : (
                  <Globe className="w-4 h-4 text-slate-400" />
                )}
                <div>
                  <span className="text-sm font-medium text-slate-800">
                    {item.city === '(not set)' ? 'Desconhecido' : item.city}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">{item.country}</span>
                </div>
              </div>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-bold">{item.users}</span>
            </div>
          );
        })}
        {sortedCities.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">Nenhuma cidade detectada</p>
        )}
      </div>
    </div>
  );
}

// Devices card (NEW)
function DevicesCard({ devices }: { devices: Record<string, number> }) {
  const total = Object.values(devices).reduce((a, b) => a + b, 0);
  const sortedDevices = Object.entries(devices).sort(([, a], [, b]) => b - a);
  
  const deviceColors: Record<string, string> = {
    desktop: 'bg-blue-500',
    mobile: 'bg-emerald-500',
    tablet: 'bg-orange-500',
  };
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
          <Monitor className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Dispositivos Ativos</h3>
          <p className="text-sm text-slate-500">Tipo de dispositivo</p>
        </div>
      </div>
      <div className="space-y-4">
        {sortedDevices.map(([device, users]) => {
          const percentage = total > 0 ? (users / total) * 100 : 0;
          const label = device === 'desktop' ? 'Computador' : device === 'mobile' ? 'Móvel' : 'Tablet';
          return (
            <div key={device}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {deviceIcons[device] || <Monitor className="w-5 h-5" />}
                  <span className="text-sm font-medium text-slate-700">{label}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{users}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${deviceColors[device] || 'bg-slate-500'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
        {sortedDevices.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">Nenhum dispositivo detectado</p>
        )}
      </div>
    </div>
  );
}

// Events card (NEW)
function EventsCard({ events }: { events: Record<string, number> }) {
  // Filter out page_view and other internal events
  const relevantEvents = Object.entries(events)
    .filter(([name]) => !['page_view', 'session_start', 'first_visit', 'user_engagement'].includes(name))
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600">
          <MousePointer className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Eventos em Tempo Real</h3>
          <p className="text-sm text-slate-500">Ações dos visitantes</p>
        </div>
      </div>
      <div className="space-y-3">
        {relevantEvents.map(([event, count], i) => {
          const label = event.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          return (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-slate-700">{label}</span>
              </div>
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-bold">{count}</span>
            </div>
          );
        })}
        {relevantEvents.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">Nenhum evento detectado</p>
        )}
      </div>
    </div>
  );
}

// Main page
export default function TempoRealPage() {
  const [data, setData] = useState<RealtimeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const result = await getRealtime();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [fetchData, autoRefresh]);

  if (loading && !data) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-500">Carregando dados em tempo real...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-red-200 p-8">
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
    );
  }

  const activePages = data?.urls ? Object.keys(data.urls).length : 0;
  const activeCountries = data?.countries ? Object.keys(data.countries).length : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link href="/admin/analytics" className="hover:text-blue-600">Análise</Link>
            <ArrowRight className="w-3 h-3" />
            <span className="text-slate-900 font-medium">Tempo Real</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Monitoramento ao Vivo</h1>
          <p className="text-slate-500">O que está acontecendo no seu site</p>
        </div>
        <div className="flex items-center gap-3">
          <LiveIndicator />
          <LastUpdate timestamp={data?.timestamp || ''} />
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RealtimeStatCard 
          title="Visitantes Agora" 
          value={data?.activeVisitors || 0} 
          icon={Users} 
          color="green"
          pulse={true}
        />
        <RealtimeStatCard 
          title="Páginas Ativas" 
          value={activePages} 
          icon={Eye} 
          color="blue" 
        />
        <RealtimeStatCard 
          title="Países" 
          value={activeCountries} 
          icon={Globe} 
          color="orange" 
        />
      </div>

      {/* Activity Trend Chart */}
      <ActivityTrendChart data={data?.minutesTrend || []} />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivePagesCard pages={data?.urls || {}} />
        <CitiesCard cities={data?.cities || []} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DevicesCard devices={data?.devices || {}} />
        <EventsCard events={data?.events || {}} />
      </div>

      {/* Auto-refresh toggle */}
      <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
        <Radio className={`w-4 h-4 ${autoRefresh ? 'text-emerald-500' : 'text-slate-400'}`} />
        <span>Atualização automática a cada 30s</span>
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            autoRefresh 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {autoRefresh ? 'Ativado' : 'Desativado'}
        </button>
      </div>
    </div>
  );
}
