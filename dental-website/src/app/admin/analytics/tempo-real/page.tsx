'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Activity,
  Users,
  Eye,
  Globe,
  MapPin,
  Clock,
  RefreshCw,
  ArrowRight,
  Zap,
  Radio,
  Monitor,
  Smartphone
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis
} from 'recharts';
import Link from 'next/link';

interface RealtimeEvent {
  __type: string;
  sessionId: string;
  eventName: string;
  createdAt: string;
  browser: string;
  os: string;
  device: string;
  country: string;
  urlPath: string;
  referrerDomain: string;
}

interface RealtimeData {
  countries: Record<string, number>;
  urls: Record<string, number>;
  referrers: Record<string, number>;
  events: RealtimeEvent[];
  series: {
    views: { x: string; y: number }[];
    visitors: { x: string; y: number }[];
  };
  totals: {
    views: number;
    visitors: number;
    events: number;
    countries: number;
  };
  activeVisitors: number;
  timestamp: number;
}

// Country names mapping
const countryNames: Record<string, string> = {
  BR: '🇧🇷 Brasil',
  US: '🇺🇸 Estados Unidos',
  PT: '🇵🇹 Portugal',
  AR: '🇦🇷 Argentina',
  MX: '🇲🇽 México',
  ES: '🇪🇸 Espanha',
  CO: '🇨🇴 Colômbia',
  CL: '🇨🇱 Chile',
  PE: '🇵🇪 Peru',
  UY: '🇺🇾 Uruguai',
  GB: '🇬🇧 Reino Unido',
  DE: '🇩🇪 Alemanha',
  FR: '🇫🇷 França',
  IT: '🇮🇹 Itália',
  CA: '🇨🇦 Canadá',
};

function getCountryName(code: string): string {
  return countryNames[code] || `🌍 ${code}`;
}

// Format page path
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

// Stats card for realtime
function RealtimeStatCard({ 
  title, 
  value, 
  icon: Icon, 
  color,
  pulse = false
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
          <p className="text-4xl font-bold text-slate-900 mt-2">
            {value.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className={`w-14 h-14 rounded-2xl ${colors.icon} flex items-center justify-center relative`}>
          <Icon className="w-7 h-7 text-white" />
          {pulse && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
          )}
        </div>
      </div>
    </div>
  );
}

// Live activity indicator
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

// Active pages list
function ActivePagesList({ urls }: { urls: Record<string, number> }) {
  const sortedUrls = Object.entries(urls)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
          <Eye className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Páginas Ativas</h3>
          <p className="text-sm text-slate-500">Sendo visualizadas agora</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {sortedUrls.map(([url, count], i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                {count}
              </div>
              <span className="text-sm text-slate-700" title={url}>
                {formatPagePath(url)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-emerald-500">
              <Activity className="w-4 h-4" />
            </div>
          </div>
        ))}
        {sortedUrls.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">Nenhuma página ativa no momento</p>
        )}
      </div>
    </div>
  );
}

// Visitors by country
function VisitorsByCountry({ countries }: { countries: Record<string, number> }) {
  const sortedCountries = Object.entries(countries)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const total = sortedCountries.reduce((sum, [, count]) => sum + count, 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Visitantes por País</h3>
          <p className="text-sm text-slate-500">Últimos 30 minutos</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {sortedCountries.map(([code, count], i) => {
          const percentage = ((count / total) * 100).toFixed(0);
          return (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">{getCountryName(code).split(' ')[0]}</span>
                <span className="text-sm text-slate-700">
                  {getCountryName(code).split(' ').slice(1).join(' ')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">{count}</span>
                <span className="text-xs text-slate-400">({percentage}%)</span>
              </div>
            </div>
          );
        })}
        {sortedCountries.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">Nenhum visitante no momento</p>
        )}
      </div>
    </div>
  );
}

// Referrers in realtime
function RealtimeReferrers({ referrers }: { referrers: Record<string, number> }) {
  const sortedReferrers = Object.entries(referrers)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600">
          <Radio className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Fontes Ativas</h3>
          <p className="text-sm text-slate-500">De onde estão vindo agora</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {sortedReferrers.map(([referrer, count], i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
            <span className="text-sm text-slate-700 truncate" title={referrer}>
              {referrer || 'Tráfego Direto'}
            </span>
            <span className="text-sm font-semibold text-slate-900 ml-2 shrink-0">
              {count}
            </span>
          </div>
        ))}
        {sortedReferrers.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">Nenhuma fonte ativa</p>
        )}
      </div>
    </div>
  );
}

// Mini Chart for last 30 min
function MiniChart({ series }: { series: { views: { x: string; y: number }[]; visitors: { x: string; y: number }[] } }) {
  if (!series?.views?.length) return null;

  const chartData = series.views.map((v, i) => ({
    time: new Date(v.x).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    views: v.y,
    visitors: series.visitors[i]?.y || 0,
  }));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Tráfego ao Vivo</h3>
          <p className="text-sm text-slate-500">Últimos 30 minutos</p>
        </div>
      </div>
      
      <div className="h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Area 
              type="monotone" 
              dataKey="views" 
              stroke="#6366f1" 
              strokeWidth={2}
              fill="url(#colorViews)" 
              name="Views"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-500" />
          <span className="text-xs text-slate-500">Visualizações</span>
        </div>
      </div>
    </div>
  );
}

// Activity Feed
function ActivityFeed({ events }: { events: RealtimeEvent[] }) {
  if (!events?.length) return null;

  const recentEvents = events.slice(0, 8);
  
  const getDeviceIcon = (device: string) => {
    if (device === 'mobile') return <Smartphone className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const countryFlags: Record<string, string> = {
    BR: '🇧🇷', US: '🇺🇸', PT: '🇵🇹', AR: '🇦🇷', MX: '🇲🇽',
    ES: '🇪🇸', CO: '🇨🇴', CL: '🇨🇱', DE: '🇩🇪', FR: '🇫🇷',
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Atividade Recente</h3>
          <p className="text-sm text-slate-500">Últimas interações em tempo real</p>
        </div>
      </div>
      
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {recentEvents.map((event, i) => (
          <div 
            key={i} 
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors animate-pulse-once"
          >
            <span className="text-lg">{countryFlags[event.country] || '🌍'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700 truncate" title={event.urlPath}>
                {event.urlPath === '/' ? 'Página Inicial' : event.urlPath}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{getDeviceIcon(event.device)}</span>
                <span>{event.browser}</span>
                <span>•</span>
                <span>{formatTime(event.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TempoRealPage() {
  const [data, setData] = useState<RealtimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/analytics/tempo-real');
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Falha ao carregar dados');
      }
      const result = await res.json();
      setData(result);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 15 seconds
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tempo Real</h1>
          <p className="text-slate-500 mt-1">Monitoramento em tempo real</p>
        </div>
        <div className="bg-white rounded-2xl p-12 flex flex-col items-center justify-center">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-slate-500 mt-4">Conectando ao monitoramento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tempo Real</h1>
          <p className="text-slate-500 mt-1">Monitoramento em tempo real</p>
        </div>
        <div className="bg-white rounded-2xl p-12 flex flex-col items-center justify-center border-2 border-dashed border-red-200">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Erro de conexão</h2>
          <p className="text-slate-500 text-center max-w-md mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reconectar
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
            <span className="text-slate-900 font-medium">Tempo Real</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Monitoramento em Tempo Real</h1>
          <p className="text-slate-500 mt-1">Veja quem está no seu site agora</p>
        </div>
        
        <div className="flex items-center gap-3">
          <LiveIndicator />
          
          {lastUpdate && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock className="w-4 h-4" />
              <span>Atualizado {lastUpdate.toLocaleTimeString('pt-BR')}</span>
            </div>
          )}
          
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <RealtimeStatCard
          title="Visitantes Ativos"
          value={data?.activeVisitors || 0}
          icon={Users}
          color="green"
          pulse={true}
        />
        <RealtimeStatCard
          title="Visualizações (30min)"
          value={data?.totals?.views || 0}
          icon={Eye}
          color="blue"
        />
        <RealtimeStatCard
          title="Eventos (30min)"
          value={data?.totals?.events || 0}
          icon={Zap}
          color="purple"
        />
        <RealtimeStatCard
          title="Países Ativos"
          value={data?.totals?.countries || 0}
          icon={Globe}
          color="orange"
        />
      </div>

      {/* Mini Chart and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MiniChart series={data?.series || { views: [], visitors: [] }} />
        <ActivityFeed events={data?.events || []} />
      </div>

      {/* Active Pages and Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivePagesList urls={data?.urls || {}} />
        <VisitorsByCountry countries={data?.countries || {}} />
      </div>

      {/* Referrers */}
      <RealtimeReferrers referrers={data?.referrers || {}} />
    </div>
  );
}
