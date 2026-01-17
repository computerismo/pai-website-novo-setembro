'use client';

import { useState, useEffect } from 'react';
import { 
  Globe, 
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
  ArrowRight,
  Laptop,
  Users,
  MapPin
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
import ReactCountryFlag from 'react-country-flag';
import { 
  getCountries, 
  getBrowsers, 
  getDevices,
  getCities,
  type CountriesResponse, 
  type BrowsersResponse,
  type DevicesResponse,
  type CityItem
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
  cities: CityItem[];
  browsers: BrowsersResponse['browsers'];
  devices: DevicesResponse['devices'];
  period: string;
}

// Country name to ISO 3166-1 alpha-2 code mapping
const countryToCode: Record<string, string> = {
  // Americas
  'Brazil': 'BR',
  'United States': 'US',
  'Canada': 'CA',
  'Mexico': 'MX',
  'Argentina': 'AR',
  'Chile': 'CL',
  'Colombia': 'CO',
  'Peru': 'PE',
  'Venezuela': 'VE',
  'Ecuador': 'EC',
  'Bolivia': 'BO',
  'Paraguay': 'PY',
  'Uruguay': 'UY',
  'Costa Rica': 'CR',
  'Panama': 'PA',
  'Guatemala': 'GT',
  'Cuba': 'CU',
  'Dominican Republic': 'DO',
  'Puerto Rico': 'PR',
  // Europe
  'Portugal': 'PT',
  'Spain': 'ES',
  'France': 'FR',
  'Germany': 'DE',
  'Italy': 'IT',
  'United Kingdom': 'GB',
  'Netherlands': 'NL',
  'Belgium': 'BE',
  'Switzerland': 'CH',
  'Austria': 'AT',
  'Poland': 'PL',
  'Sweden': 'SE',
  'Norway': 'NO',
  'Denmark': 'DK',
  'Finland': 'FI',
  'Ireland': 'IE',
  'Greece': 'GR',
  'Czech Republic': 'CZ',
  'Czechia': 'CZ',
  'Romania': 'RO',
  'Hungary': 'HU',
  'Ukraine': 'UA',
  'Russia': 'RU',
  // Asia & Oceania
  'Japan': 'JP',
  'China': 'CN',
  'South Korea': 'KR',
  'India': 'IN',
  'Indonesia': 'ID',
  'Thailand': 'TH',
  'Vietnam': 'VN',
  'Philippines': 'PH',
  'Malaysia': 'MY',
  'Singapore': 'SG',
  'Australia': 'AU',
  'New Zealand': 'NZ',
  'Taiwan': 'TW',
  'Hong Kong': 'HK',
  // Middle East & Africa
  'Israel': 'IL',
  'United Arab Emirates': 'AE',
  'Saudi Arabia': 'SA',
  'Turkey': 'TR',
  'South Africa': 'ZA',
  'Egypt': 'EG',
  'Morocco': 'MA',
  'Nigeria': 'NG',
  'Angola': 'AO',
};

/**
 * Get ISO country code from country name
 */
function getCountryCode(country: string): string | null {
  if (!country || country === '(not set)' || country === 'not set' || country === 'Unknown') {
    return null;
  }
  return countryToCode[country] || null;
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

// Countries list card (simplified)
function CountriesCard({ data }: { data: CountriesResponse['countries'] }) {
  const total = data.reduce((sum, item) => sum + item.y, 0);

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
      
      <div className="space-y-3">
        {data.slice(0, 8).map((country, i) => {
          const percentage = total > 0 ? ((country.y / total) * 100).toFixed(1) : '0';
          const countryCode = getCountryCode(country.x);
          return (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-2">
                {countryCode ? (
                  <ReactCountryFlag
                    countryCode={countryCode}
                    svg
                    style={{ width: '1.5em', height: '1.5em' }}
                    title={country.x}
                  />
                ) : (
                  <Globe className="w-5 h-5 text-slate-400" />
                )}
                <span className="font-medium text-slate-800">{getCountryDisplayName(country.x)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{percentage}%</span>
                <span className="text-sm font-bold text-slate-900">{country.y.toLocaleString('pt-BR')}</span>
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

// Cities list card (NEW)
function CitiesCard({ data }: { data: CityItem[] }) {
  const total = data.reduce((sum, item) => sum + item.visitors, 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Cidades</h3>
          <p className="text-sm text-slate-500">Localização dos visitantes</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {data.slice(0, 8).map((city, i) => {
          const percentage = total > 0 ? ((city.visitors / total) * 100).toFixed(1) : '0';
          const countryCode = getCountryCode(city.country);
          const cityName = city.city === '(not set)' ? 'Desconhecido' : city.city;
          return (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-2">
                {countryCode ? (
                  <ReactCountryFlag
                    countryCode={countryCode}
                    svg
                    style={{ width: '1.2em', height: '1.2em' }}
                    title={city.country}
                  />
                ) : (
                  <Globe className="w-4 h-4 text-slate-400" />
                )}
                <span className="font-medium text-slate-800">{cityName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{percentage}%</span>
                <span className="text-sm font-bold text-slate-900">{city.visitors.toLocaleString('pt-BR')}</span>
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

// Browsers chart
import { FaChrome, FaFirefox, FaSafari, FaEdge, FaOpera, FaInternetExplorer } from 'react-icons/fa';
import { SiSamsung } from 'react-icons/si';
import { Compass } from 'lucide-react';

// Browser icon mapping
const browserIcons: Record<string, React.ReactNode> = {
  'Chrome': <FaChrome className="w-4 h-4" style={{ color: '#4285F4' }} />,
  'Firefox': <FaFirefox className="w-4 h-4" style={{ color: '#FF7139' }} />,
  'Safari': <FaSafari className="w-4 h-4" style={{ color: '#006CFF' }} />,
  'Edge': <FaEdge className="w-4 h-4" style={{ color: '#0078D7' }} />,
  'Opera': <FaOpera className="w-4 h-4" style={{ color: '#FF1B2D' }} />,
  'Internet Explorer': <FaInternetExplorer className="w-4 h-4" style={{ color: '#0076D6' }} />,
  'Samsung Internet': <SiSamsung className="w-4 h-4" style={{ color: '#1428A0' }} />,
};

function getBrowserIcon(browser: string): React.ReactNode {
  return browserIcons[browser] || <Compass className="w-4 h-4 text-slate-400" />;
}

function BrowsersCard({ data }: { data: BrowsersResponse['browsers'] }) {
  const total = data.reduce((sum, item) => sum + item.y, 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Navegadores</h3>
          <p className="text-sm text-slate-500">Navegadores mais usados</p>
        </div>
      </div>
      
      {/* Table layout instead of chart */}
      <div className="space-y-3">
        {data.slice(0, 6).map((browser, i) => {
          const percentage = total > 0 ? ((browser.y / total) * 100) : 0;
          return (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                {getBrowserIcon(browser.x)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-800 truncate">{browser.x}</span>
                  <span className="text-sm font-bold text-slate-900 ml-2">{browser.y}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: COLORS[i % COLORS.length]
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
        {data.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">Nenhum dado disponível</p>
        )}
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
      
      <div className="space-y-4">
        {chartData.map((device, i) => {
          const percentage = total > 0 ? (device.value / total) * 100 : 0;
          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: device.color }}
                  >
                    {deviceIcons[device.icon] || <Monitor className="w-4 h-4" />}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{device.name}</span>
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
        {data.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">Nenhum dado disponível</p>
        )}
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
            <Compass className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Principal Navegador</p>
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
            <p className="text-xs text-slate-500">Principal Dispositivo</p>
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
      const [countriesRes, browsersRes, devicesRes, citiesRes] = await Promise.all([
        getCountries(period),
        getBrowsers(period),
        getDevices(period),
        getCities(period),
      ]);
      
      setData({
        countries: countriesRes.countries,
        cities: citiesRes.cities,
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

      {/* Countries and Cities - side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CountriesCard data={data?.countries || []} />
        <CitiesCard data={data?.cities || []} />
      </div>

      {/* Browsers and Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BrowsersCard data={data?.browsers || []} />
        <DevicesCard data={data?.devices || []} />
      </div>
    </div>
  );
}
