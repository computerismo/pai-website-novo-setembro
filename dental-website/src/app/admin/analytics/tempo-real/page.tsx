'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Users,
  Eye,
  Globe,
  RefreshCw,
  ArrowRight,
  Radio,
  MapPin,
  Monitor,
  Smartphone,
  Tablet,
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
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';
import { getRealtime, geocodeCities, type RealtimeResponse, type RealtimeCityItem, type GeocodedCity } from '@/lib/analytics/ga4-api';

// Country code mapping for flags
const countryToCode: Record<string, string> = {
  'Brazil': 'BR', 'United States': 'US', 'Canada': 'CA', 'Mexico': 'MX',
  'Argentina': 'AR', 'Chile': 'CL', 'Colombia': 'CO', 'Peru': 'PE',
  'Portugal': 'PT', 'Spain': 'ES', 'France': 'FR', 'Germany': 'DE',
  'Italy': 'IT', 'United Kingdom': 'GB', 'Poland': 'PL', 'Japan': 'JP',
  'Australia': 'AU', 'India': 'IN', 'China': 'CN', 'Russia': 'RU',
  'Netherlands': 'NL', 'Belgium': 'BE', 'Switzerland': 'CH',
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
  desktop: <Monitor className="w-4 h-4" />,
  mobile: <Smartphone className="w-4 h-4" />,
  tablet: <Tablet className="w-4 h-4" />,
};

// Stats card (matching other analytics pages styling)
function RealtimeStatCard({ 
  title, value, icon: Icon, color, pulse = false
}: { 
  title: string; 
  value: number; 
  icon: React.ElementType;
  color: string;
  pulse?: boolean;
}) {
  const colorClasses: Record<string, { iconBg: string; iconText: string }> = {
    green: { iconBg: 'bg-emerald-100', iconText: 'text-emerald-600' },
    blue: { iconBg: 'bg-blue-100', iconText: 'text-blue-600' },
    purple: { iconBg: 'bg-purple-100', iconText: 'text-purple-600' },
    orange: { iconBg: 'bg-orange-100', iconText: 'text-orange-600' },
  };
  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colors.iconBg} relative`}>
          <Icon className={`w-4 h-4 ${colors.iconText}`} />
          {pulse && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />}
        </div>
        <div>
          <p className="text-xs text-slate-500">{title}</p>
          <p className="text-lg font-bold text-slate-900">{value.toLocaleString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
}

// Live indicator
function LiveIndicator() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-full">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
      </span>
      <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">Ao Vivo</span>
    </div>
  );
}

// World Map Component
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

function WorldMap({ cities, geocodedCities }: { cities: RealtimeCityItem[]; geocodedCities: GeocodedCity[] }) {
  // Use geocoded cities for markers
  const markers = geocodedCities.map(city => ({
    name: city.city,
    country: city.country,
    users: city.users,
    coordinates: [city.lng, city.lat] as [number, number],
  }));

  // Calculate dynamic map center and zoom
  const mapConfig = useMemo(() => {
    if (geocodedCities.length === 0) {
      return { center: [-20, 10] as [number, number], scale: 120 };
    }

    if (geocodedCities.length === 1) {
      const city = geocodedCities[0];
      return { 
        center: [city.lng, city.lat] as [number, number], 
        scale: 800 
      };
    }

    // Calculate bounding box
    const lngs = geocodedCities.map(c => c.lng);
    const lats = geocodedCities.map(c => c.lat);
    
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    const centerLng = (minLng + maxLng) / 2;
    const centerLat = (minLat + maxLat) / 2;

    // Calculate spread
    const deltaLng = maxLng - minLng;
    const deltaLat = maxLat - minLat;
    const maxDelta = Math.max(deltaLng, deltaLat);

    // Heuristic for scale (inverse of spread)
    // Base scale 120 (world), max scale 600 (region)
    // Buffer factor of 1.5 to keep points away from edges
    const scale = Math.min(800, Math.max(120, 360 / (maxDelta * 1.5) * 100));

    return {
      center: [centerLng, centerLat] as [number, number],
      scale: scale
    };
  }, [geocodedCities]);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Mapa de Visitantes</h3>
          <p className="text-sm text-slate-500">Localização dos usuários ativos</p>
        </div>
      </div>
      
      <div className="relative bg-slate-50 rounded-xl overflow-hidden" style={{ height: '320px' }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: mapConfig.scale,
            center: mapConfig.center,
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: Array<{ rsmKey: string }> }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#e2e8f0"
                  stroke="#cbd5e1"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: '#cbd5e1', outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>
          
          {markers.map((marker, i) => (
            <Marker key={i} coordinates={marker.coordinates}>
              {/* Pulse animation */}
              <circle r={8 + marker.users * 2} fill="#3b82f6" opacity={0.2}>
                <animate
                  attributeName="r"
                  from={8 + marker.users * 2}
                  to={16 + marker.users * 3}
                  dur="1.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from={0.3}
                  to={0}
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
              {/* Main dot */}
              <circle r={4 + marker.users} fill="#3b82f6" stroke="#fff" strokeWidth={2} />
              {/* User count */}
              <text
                textAnchor="middle"
                y={-12}
                style={{
                  fontFamily: 'system-ui',
                  fill: '#1e40af',
                  fontSize: '10px',
                  fontWeight: 'bold',
                }}
              >
                {marker.users}
              </text>
            </Marker>
          ))}
        </ComposableMap>
        
        {markers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-slate-400">Nenhum usuário ativo no momento</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Cities List
function CitiesList({ cities }: { cities: RealtimeCityItem[] }) {
  const filteredCities = cities
    .filter(c => c.city && c.city !== '(not set)')
    .sort((a, b) => b.users - a.users)
    .slice(0, 8);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Cidades Ativas</h3>
          <p className="text-sm text-slate-500">Últimos 30 minutos</p>
        </div>
      </div>
      
      <div className="space-y-2">
        {filteredCities.map((city, i) => {
          const countryCode = getCountryCode(city.country);
          return (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-2">
                {countryCode ? (
                  <ReactCountryFlag countryCode={countryCode} svg style={{ width: '1.2em', height: '1.2em' }} />
                ) : (
                  <Globe className="w-4 h-4 text-slate-400" />
                )}
                <span className="text-sm font-medium text-slate-700">{city.city}</span>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">{city.users}</span>
            </div>
          );
        })}
        {filteredCities.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">Nenhuma cidade detectada</p>
        )}
      </div>
    </div>
  );
}

// 30-minute trend chart
function ActivityTrendChart({ data }: { data: Array<{ minutesAgo: number; users: number }> }) {
  // Fill in missing minutes and sort data
  const chartData = [];
  for (let i = 30; i >= 0; i--) {
    const found = data.find(d => d.minutesAgo === i);
    chartData.push({
      minute: i === 0 ? 'Agora' : `-${i}m`,
      users: found?.users || 0,
    });
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
          <Radio className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Atividade (Últimos 30 min)</h3>
          <p className="text-sm text-slate-500">Usuários por minuto</p>
        </div>
      </div>
      
      <div className="h-32" style={{ minHeight: '128px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="minute" 
              tick={{ fontSize: 10, fill: '#94a3b8' }} 
              tickLine={false}
              axisLine={false}
              interval={5}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: '#94a3b8' }} 
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: 'none', 
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(value) => [`${value ?? 0} usuários`, 'Ativos']}
            />
            <Area 
              type="monotone" 
              dataKey="users" 
              stroke="#10b981" 
              strokeWidth={2}
              fillOpacity={1} 
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
  
  const total = sortedPages.reduce((sum, [, count]) => sum + count, 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
          <Eye className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Páginas Ativas</h3>
          <p className="text-sm text-slate-500">Sendo visualizadas agora</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {sortedPages.map(([page, count], i) => {
          const percentage = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-700 truncate">{formatPagePath(page)}</span>
                <span className="text-sm font-bold text-slate-900 ml-2">{count}</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
        {sortedPages.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">Nenhuma página ativa</p>
        )}
      </div>
    </div>
  );
}

// Devices card
function DevicesCard({ devices }: { devices: Record<string, number> }) {
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];
  const sortedDevices = Object.entries(devices)
    .sort(([, a], [, b]) => b - a);
  
  const total = sortedDevices.reduce((sum, [, count]) => sum + count, 0);
  
  const deviceLabels: Record<string, string> = {
    desktop: 'Computador',
    mobile: 'Móvel',
    tablet: 'Tablet',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600">
          <Monitor className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Dispositivos</h3>
          <p className="text-sm text-slate-500">Como estão acessando</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {sortedDevices.map(([device, count], i) => {
          const percentage = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={i} className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              >
                {deviceIcons[device.toLowerCase()] || <Monitor className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-800">{deviceLabels[device.toLowerCase()] || device}</span>
                  <span className="text-sm font-bold text-slate-900 ml-2">{count}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%`, backgroundColor: COLORS[i % COLORS.length] }}
                  />
                </div>
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

// Main page
export default function TempoRealPage() {
  const [data, setData] = useState<RealtimeResponse | null>(null);
  const [geocodedCities, setGeocodedCities] = useState<GeocodedCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getRealtime();
      setData(result);
      setLastUpdate(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      setError(null);
      
      // Geocode cities for map display
      if (result.cities && result.cities.length > 0) {
        try {
          const geocoded = await geocodeCities(result.cities);
          setGeocodedCities(geocoded.cities);
        } catch (geoErr) {
          console.error('Geocoding error:', geoErr);
          // Continue without geocoded cities
        }
      }
    } catch (err) {
      console.error('Error fetching realtime data:', err);
      setError('Erro ao carregar dados em tempo real');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  const activePages = Object.keys(data?.urls || {}).length;
  const activeCountries = Object.keys(data?.countries || {}).length;
  const activeDevices = Object.keys(data?.devices || {}).length;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link href="/admin/analytics" className="hover:text-blue-600 transition-colors">
              Análise de Tráfego
            </Link>
            <ArrowRight className="w-3 h-3" />
            <span className="text-slate-700 font-medium">Tempo Real</span>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-slate-900">Tempo Real</h1>
            <LiveIndicator />
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Última atualização: {lastUpdate}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              autoRefresh 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            Auto: {autoRefresh ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <RealtimeStatCard 
          title="Usuários Agora" 
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
        <RealtimeStatCard 
          title="Dispositivos" 
          value={activeDevices} 
          icon={Monitor} 
          color="purple" 
        />
      </div>

      {/* Map and Cities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WorldMap cities={data?.cities || []} geocodedCities={geocodedCities} />
        </div>
        <div className="lg:col-span-1">
          <CitiesList cities={data?.cities || []} />
        </div>
      </div>

      {/* Activity Trend */}
      <ActivityTrendChart data={data?.minutesTrend || []} />

      {/* Pages and Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivePagesCard pages={data?.urls || {}} />
        <DevicesCard devices={data?.devices || {}} />
      </div>
    </div>
  );
}
