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
} from 'lucide-react';
import Link from 'next/link';
import { getRealtime, type RealtimeResponse } from '@/lib/analytics/ga4-api';

// Country names mapping
const countryNames: Record<string, string> = {
  Brazil: '🇧🇷 Brasil',
  'United States': '🇺🇸 Estados Unidos',
  Portugal: '🇵🇹 Portugal',
  Argentina: '🇦🇷 Argentina',
  Mexico: '🇲🇽 México',
  Spain: '🇪🇸 Espanha',
  Colombia: '🇨🇴 Colômbia',
  Chile: '🇨🇱 Chile',
  Peru: '🇵🇪 Peru',
  Uruguay: '🇺🇾 Uruguai',
  'United Kingdom': '🇬🇧 Reino Unido',
  Germany: '🇩🇪 Alemanha',
  France: '🇫🇷 França',
  Italy: '🇮🇹 Itália',
  Canada: '🇨🇦 Canadá',
};

function getCountryName(country: string): string {
  if (!country) return '🌍 Desconhecido';
  return countryNames[country] || `🌍 ${country}`;
}

// Format page path
function formatPagePath(path: string): string {
  if (path === '/' || path === 'Home' || path === 'Página Inicial') return 'Página Inicial';
  if (path.startsWith('/botox') || path.includes('Botox')) return 'Botox para Bruxismo';
  if (path.startsWith('/placa') || path.includes('Placa')) return 'Placa Miorrelaxante';
  if (path.startsWith('/tratamento') || path.includes('Tratamento')) return 'Tratamento Bruxismo';
  if (path.startsWith('/blog') || path.includes('Blog')) return path.replace('/blog/', 'Blog: ') || 'Blog';
  if (path.startsWith('/contato') || path.includes('Contato')) return 'Contato';
  if (path.startsWith('/sobre') || path.includes('Sobre')) return 'Sobre';
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

// Filter helper - exclude admin pages
function isPublicPage(path: string | undefined): boolean {
  if (!path) return false;
  const lowerPath = path.toLowerCase();
  return !lowerPath.includes('admin') && !lowerPath.includes('login');
}

// Active pages list
function ActivePagesList({ urls }: { urls: Record<string, number> }) {
  const sortedUrls = Object.entries(urls)
    .filter(([url]) => isPublicPage(url))
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

// Visitors by Country
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
          <p className="text-sm text-slate-500">Ativos agora</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {sortedCountries.map(([country, count], i) => {
          const percentage = total > 0 ? ((count / total) * 100).toFixed(0) : '0';
          
          return (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl rounded shadow-sm shrink-0">
                  {countryNames[country]?.split(' ')[0] || '🌍'}
                </span>
                <div className="truncate">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {country || 'Desconhecido'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-16 sm:w-24 h-2 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percentage}%` }} />
                </div>
                <div className="text-right min-w-[2rem]">
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

export default function TempoRealPage() {
  const [data, setData] = useState<RealtimeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const result = await getRealtime();
      setData(result);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Failed to fetch realtime data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // 10s refresh
    return () => clearInterval(interval);
  }, [fetchData]);

  const activeVisitors = data?.activeVisitors || 0;
  const totalPages = Object.keys(data?.urls || {}).filter(isPublicPage).length;
  const totalCountries = Object.keys(data?.countries || {}).length;

  if (loading && !data) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-500">Conectando ao Google Analytics...</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <RealtimeStatCard
          title="Visitantes Agora"
          value={activeVisitors}
          icon={Users}
          color="green"
          pulse={activeVisitors > 0}
        />
        <RealtimeStatCard
          title="Páginas Ativas"
          value={totalPages}
          icon={Eye}
          color="blue"
        />
        <RealtimeStatCard
          title="Países"
          value={totalCountries}
          icon={Globe}
          color="orange"
        />
      </div>

      {/* Note about GA4 limitations */}
      {activeVisitors === 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Sem visitantes ativos no momento</p>
              <p className="text-xs text-amber-600 mt-1">
                O Google Analytics atualiza dados em tempo real a cada poucos segundos. 
                Os dados aparecerão assim que houver visitantes ativos.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivePagesList urls={data?.urls || {}} />
        <VisitorsByCountry countries={data?.countries || {}} />
      </div>
    </div>
  );
}
