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

// Filter helper
function isPublicPage(path: string | undefined): boolean {
  if (!path) return false;
  return !path.startsWith('/admin') && !path.startsWith('/login');
}

// Active pages list
function ActivePagesList({ urls }: { urls: Record<string, number> }) {
  const sortedUrls = Object.entries(urls)
    .filter(([url]) => isPublicPage(url)) // Filter admin pages
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
          <p className="text-sm text-slate-500">Sendo visualizadas agora (público)</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {sortedUrls.map(([url, count], i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                {count}
              </div>
              <span className="text-sm text-slate-700 font-medium" title={url}>
                {formatPagePath(url)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-emerald-500 animate-pulse">
              <Activity className="w-4 h-4" />
            </div>
          </div>
        ))}
        {sortedUrls.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">Nenhuma página pública ativa</p>
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
      
      <div className="space-y-4">
        {sortedCountries.map(([code, count], i) => {
          const percentage = total > 0 ? ((count / total) * 100).toFixed(0) : '0';
          return (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <span className="text-2xl rounded shadow-sm">{getCountryName(code).split(' ')[0]}</span>
                <span className="text-sm font-medium text-slate-700">
                  {getCountryName(code).split(' ').slice(1).join(' ')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percentage}%` }} />
                </div>
                <div className="text-right min-w-[3rem]">
                  <span className="text-sm font-bold text-slate-900">{count}</span>
                </div>
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
    
  const total = sortedReferrers.reduce((sum, [, c]) => sum + c, 0);

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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sortedReferrers.map(([referrer, count], i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-sm font-medium text-slate-700 truncate max-w-[70%]" title={referrer}>
              {referrer || 'Tráfego Direto'}
            </span>
            <span className="px-2 py-1 bg-white rounded-md text-xs font-bold text-purple-600 shadow-sm border border-slate-100">
              {count}
            </span>
          </div>
        ))}
        {sortedReferrers.length === 0 && (
          <div className="col-span-full">
            <p className="text-sm text-slate-400 text-center py-8">Nenhuma fonte ativa</p>
          </div>
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
  
  const totalViews = chartData.reduce((acc, curr) => acc + curr.views, 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Tráfego (30min)</h3>
            <p className="text-sm text-slate-500">{totalViews} visualizações recentes</p>
          </div>
        </div>
        <div className="flex gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                Views
            </span>
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
            {/* No Tooltip as requested */}
            <Area 
              type="monotone" 
              dataKey="views" 
              stroke="#6366f1" 
              strokeWidth={2}
              fill="url(#colorViews)" 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Activity Feed
function ActivityFeed({ events }: { events: RealtimeEvent[] }) {
  if (!events) return null;
  
  // Filter admin events
  const publicEvents = events.filter(e => isPublicPage(e.urlPath)).slice(0, 8);

  const getDeviceIcon = (device: string) => {
    if (device === 'mobile') return <Smartphone className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const countryFlags: Record<string, string> = {
    BR: '🇧🇷', US: '🇺🇸', PT: '🇵🇹', AR: '🇦🇷', MX: '🇲🇽',
    ES: '🇪🇸', CO: '🇨🇴', CL: '🇨🇱', DE: '🇩🇪', FR: '🇫🇷',
  };

  const formatTimeKey = (dateStr: string) => {
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
          <p className="text-sm text-slate-500">Últimas interações (Público)</p>
        </div>
      </div>
      
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
        {publicEvents.map((event, i) => (
          <div 
            key={i} 
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100/50"
          >
            <span className="text-xl filter drop-shadow-sm">{countryFlags[event.country] || '🌍'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate" title={event.urlPath}>
                {formatPagePath(event.urlPath)}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {getDeviceIcon(event.device)} {event.device}
                </span>
                <span>{event.browser}</span>
                <span className="text-slate-300">•</span>
                <span className="font-mono text-slate-400">{formatTimeKey(event.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
        {publicEvents.length === 0 && (
             <p className="text-sm text-slate-400 text-center py-8">Nenhuma atividade recente</p>
        )}
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
        throw new Error('Falha de conexão');
      }
      const result = await res.json();
      setData(result);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      // Slient error in realtime usually better, or unobtrusive
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // 10s refresh
    return () => clearInterval(interval);
  }, [fetchData]);

  // Calculations excluding admin
  const activeVisitors = data?.activeVisitors || 0; 
  // Note: activeVisitors from API is a hard count, hard to filter client side without raw session data.
  // We accepted "Admin visits in total count" earlier as unavoidable without deep changes, 
  // but we hid them from the lists.

  if (loading && !data) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-500">Conectando ao satélite...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
           <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link href="/admin/analytics" className="hover:text-blue-600 transition-colors">Análise</Link>
            <ArrowRight className="w-3 h-3" />
            <span className="text-slate-900 font-medium">Tempo Real</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Monitoramento ao Vivo</h1>
          <p className="text-slate-500">O que está acontecendo agora no seu site</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
          <LiveIndicator />
          <div className="h-4 w-px bg-slate-200 mx-2" />
          {lastUpdate && (
            <span className="text-xs text-slate-500 font-mono">
              Last: {lastUpdate.toLocaleTimeString('pt-BR')}
            </span>
          )}
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <RealtimeStatCard
          title="Visitantes Agora"
          value={activeVisitors}
          icon={Users}
          color="green"
          pulse={activeVisitors > 0}
        />
        <RealtimeStatCard
          title="Views (30min)"
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
          title="Países"
          value={data?.totals?.countries || 0}
          icon={Globe}
          color="orange"
        />
      </div>

      {/* Charts & Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MiniChart series={data?.series || { views: [], visitors: [] }} />
        <ActivityFeed events={data?.events || []} />
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivePagesList urls={data?.urls || {}} />
        <VisitorsByCountry countries={data?.countries || {}} />
      </div>

      <RealtimeReferrers referrers={data?.referrers || {}} />
    </div>
  );
}
