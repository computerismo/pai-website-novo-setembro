'use client';

import { useState, useEffect } from 'react';
import { 
  Globe, 
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
  ArrowRight,
  Chrome,
  Laptop,
  Users
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import Link from 'next/link';
import { 
  getCountries, 
  getBrowsers, 
  getDevices,
  type CountriesResponse, 
  type BrowsersResponse,
  type DevicesResponse
} from '@/lib/analytics/ga4-api';

const PERIODS = [
  { value: '24h', label: 'Últimas 24h' },
  { value: '7d', label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
  { value: '90d', label: 'Últimos 90 dias' },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

interface AudienceData {
  countries: CountriesResponse['countries'];
  browsers: BrowsersResponse['browsers'];
  devices: DevicesResponse['devices'];
  period: string;
}

// Comprehensive country to emoji flag mapping
const countryFlags: Record<string, string> = {
  // Americas
  'Brazil': '🇧🇷',
  'United States': '🇺🇸',
  'Canada': '🇨🇦',
  'Mexico': '🇲🇽',
  'Argentina': '🇦🇷',
  'Chile': '🇨🇱',
  'Colombia': '🇨🇴',
  'Peru': '🇵🇪',
  'Venezuela': '🇻🇪',
  'Ecuador': '🇪🇨',
  'Bolivia': '🇧🇴',
  'Paraguay': '🇵🇾',
  'Uruguay': '🇺🇾',
  'Costa Rica': '🇨🇷',
  'Panama': '🇵🇦',
  'Guatemala': '🇬🇹',
  'Cuba': '🇨🇺',
  'Dominican Republic': '🇩🇴',
  'Puerto Rico': '🇵🇷',
  // Europe
  'Portugal': '🇵🇹',
  'Spain': '🇪🇸',
  'France': '🇫🇷',
  'Germany': '🇩🇪',
  'Italy': '🇮🇹',
  'United Kingdom': '🇬🇧',
  'Netherlands': '🇳🇱',
  'Belgium': '🇧🇪',
  'Switzerland': '🇨🇭',
  'Austria': '🇦🇹',
  'Poland': '🇵🇱',
  'Sweden': '🇸🇪',
  'Norway': '🇳🇴',
  'Denmark': '🇩🇰',
  'Finland': '🇫🇮',
  'Ireland': '🇮🇪',
  'Greece': '🇬🇷',
  'Czech Republic': '🇨🇿',
  'Czechia': '🇨🇿',
  'Romania': '🇷🇴',
  'Hungary': '🇭🇺',
  'Ukraine': '🇺🇦',
  'Russia': '🇷🇺',
  // Asia & Oceania
  'Japan': '🇯🇵',
  'China': '🇨🇳',
  'South Korea': '🇰🇷',
  'India': '🇮🇳',
  'Indonesia': '🇮🇩',
  'Thailand': '🇹🇭',
  'Vietnam': '🇻🇳',
  'Philippines': '🇵🇭',
  'Malaysia': '🇲🇾',
  'Singapore': '🇸🇬',
  'Australia': '🇦🇺',
  'New Zealand': '🇳🇿',
  'Taiwan': '🇹🇼',
  'Hong Kong': '🇭🇰',
  // Middle East & Africa
  'Israel': '🇮🇱',
  'United Arab Emirates': '🇦🇪',
  'Saudi Arabia': '🇸🇦',
  'Turkey': '🇹🇷',
  'South Africa': '🇿🇦',
  'Egypt': '🇪🇬',
  'Morocco': '🇲🇦',
  'Nigeria': '🇳🇬',
  'Angola': '🇦🇴',
};

/**
 * Get country flag emoji. Returns globe for unknown/not set.
 */
function getCountryFlag(country: string): string {
  if (!country || country === '(not set)' || country === 'not set' || country === 'Unknown') {
    return '🌍';
  }
  return countryFlags[country] || '🌍';
}

/**
 * Get display name for country (handles "(not set)")
 */
function getCountryDisplayName(country: string): string {
  if (!country || country === '(not set)' || country === 'not set') {
    return 'Desconhecido';
  }
  return country;
}

// Device icons
const deviceIcons: Record<string, React.ReactNode> = {
  desktop: <Monitor className="w-5 h-5" />,
  mobile: <Smartphone className="w-5 h-5" />,
  tablet: <Tablet className="w-5 h-5" />,
};

function getDeviceLabel(device: string): string {
  const labels: Record<string, string> = {
    desktop: 'Computador',
    mobile: 'Móvel',
    tablet: 'Tablet',
  };
  return labels[device.toLowerCase()] || device;
}

// Countries chart
function CountriesCard({ data }: { data: CountriesResponse['countries'] }) {
  const total = data.reduce((sum, item) => sum + item.y, 0);
  
  const chartData = data.slice(0, 8).map((item, i) => ({
    name: item.x,
    value: item.y,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Países</h3>
          <p className="text-sm text-slate-500">De onde vêm seus visitantes</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* List */}
        <div className="space-y-3">
          {data.slice(0, 6).map((country, i) => {
            const percentage = total > 0 ? ((country.y / total) * 100).toFixed(1) : '0';
            return (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getCountryFlag(country.x)}</span>
                  <span className="text-sm font-medium text-slate-700">{getCountryDisplayName(country.x)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{percentage}%</span>
                  <span className="text-sm font-bold text-slate-900">{country.y}</span>
                </div>
              </div>
            );
          })}
          {data.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-4">Nenhum dado disponível</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Browsers chart
function BrowsersCard({ data }: { data: BrowsersResponse['browsers'] }) {
  const chartData = data.slice(0, 6).map((item, i) => ({
    name: item.x,
    visitors: item.y,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600">
          <Chrome className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Navegadores</h3>
          <p className="text-sm text-slate-500">Navegadores mais usados</p>
        </div>
      </div>
      
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" fontSize={10} stroke="#94a3b8" tickLine={false} axisLine={false} />
            <YAxis 
              type="category" 
              dataKey="name" 
              fontSize={10} 
              stroke="#94a3b8" 
              tickLine={false} 
              axisLine={false}
              width={80}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="visitors" radius={[0, 4, 4, 0]} barSize={20}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Devices chart
function DevicesCard({ data }: { data: DevicesResponse['devices'] }) {
  const total = data.reduce((sum, item) => sum + item.y, 0);
  
  const chartData = data.map((item, i) => ({
    name: getDeviceLabel(item.x),
    value: item.y,
    color: COLORS[i % COLORS.length],
    icon: item.x.toLowerCase(),
  }));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
          <Laptop className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Dispositivos</h3>
          <p className="text-sm text-slate-500">Como acessam seu site</p>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-8">
        <div className="w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-4">
          {chartData.map((device, i) => {
            const percentage = total > 0 ? ((device.value / total) * 100).toFixed(0) : '0';
            return (
              <div key={i} className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: device.color }}
                >
                  {deviceIcons[device.icon] || <Monitor className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{device.name}</p>
                  <p className="text-xs text-slate-500">{device.value} ({percentage}%)</p>
                </div>
              </div>
            );
          })}
          {data.length === 0 && (
            <p className="text-sm text-slate-400">Nenhum dado disponível</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Summary stats
function SummaryCard({ 
  countries, 
  browsers, 
  devices 
}: { 
  countries: CountriesResponse['countries'];
  browsers: BrowsersResponse['browsers'];
  devices: DevicesResponse['devices'];
}) {
  const totalVisitors = countries.reduce((sum, c) => sum + c.y, 0);
  const topCountry = countries[0]?.x || '-';
  const topBrowser = browsers[0]?.x || '-';
  const topDevice = devices[0] ? getDeviceLabel(devices[0].x) : '-';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Visitantes</p>
            <p className="text-lg font-bold text-slate-900">{totalVisitors.toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-100">
            <Globe className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">País Principal</p>
            <p className="text-lg font-bold text-slate-900">{topCountry}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-100">
            <Chrome className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Navegador Top</p>
            <p className="text-lg font-bold text-slate-900">{topBrowser}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-100">
            <Monitor className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Dispositivo Top</p>
            <p className="text-lg font-bold text-slate-900">{topDevice}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AudienciaPage() {
  const [data, setData] = useState<AudienceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('7d');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [countriesRes, browsersRes, devicesRes] = await Promise.all([
        getCountries(period),
        getBrowsers(period),
        getDevices(period),
      ]);
      
      setData({
        countries: countriesRes.countries,
        browsers: browsersRes.browsers,
        devices: devicesRes.devices,
        period,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Audiência</h1>
          <p className="text-slate-500 mt-1">Quem são seus visitantes</p>
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
          <h1 className="text-2xl font-bold text-slate-900">Audiência</h1>
          <p className="text-slate-500 mt-1">Quem são seus visitantes</p>
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
            <span className="text-slate-900 font-medium">Audiência</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Audiência</h1>
          <p className="text-slate-500 mt-1">Quem são seus visitantes</p>
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

      {/* Summary */}
      <SummaryCard 
        countries={data?.countries || []} 
        browsers={data?.browsers || []} 
        devices={data?.devices || []} 
      />

      {/* Countries */}
      <CountriesCard data={data?.countries || []} />

      {/* Browsers and Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BrowsersCard data={data?.browsers || []} />
        <DevicesCard data={data?.devices || []} />
      </div>
    </div>
  );
}
