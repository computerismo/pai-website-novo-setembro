'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Tablet,
  Laptop,
  Globe,
  MapPin,
  Chrome,
  Monitor as ComputerIcon,
  RefreshCw,
  ArrowRight,
  Languages,
  Layout
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const MapWithNoSSR = dynamic<{ data: MetricData[] }>(() => import('@/components/WorldMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
      Carregando mapa...
    </div>
  )
});

const PERIODS = [
  { value: '24h', label: 'Últimas 24h' },
  { value: '7d', label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
  { value: '90d', label: 'Últimos 90 dias' },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#14b8a6'];

interface MetricData {
  x: string;
  y: number;
}

interface AudienceData {
  devices: MetricData[];
  browsers: MetricData[];
  os: MetricData[];
  countries: MetricData[];
  cities: MetricData[];
  languages: MetricData[];
  screens: MetricData[];
  period: string;
}

// Device icons
const deviceIcons: Record<string, React.ReactNode> = {
  desktop: <Monitor className="w-5 h-5" />,
  laptop: <Monitor className="w-5 h-5" />,
  mobile: <Smartphone className="w-5 h-5" />,
  tablet: <Tablet className="w-5 h-5" />,
};

// Country names mapping
const countryNames: Record<string, string> = {
  BR: 'Brasil',
  US: 'Estados Unidos',
  PT: 'Portugal',
  AR: 'Argentina',
  MX: 'México',
  ES: 'Espanha',
  CO: 'Colômbia',
  CL: 'Chile',
  PE: 'Peru',
  UY: 'Uruguai',
};

function getCountryName(code: string): string {
  return countryNames[code] || code;
}

// Static donut chart with side legend
function PieChartCard({ 
  title, 
  subtitle,
  data, 
  icon: Icon,
  formatLabel = (x: string) => x
}: { 
  title: string; 
  subtitle?: string;
  data: MetricData[]; 
  icon: React.ElementType;
  formatLabel?: (x: string) => string;
}) {
  const chartData = data.slice(0, 6).map((item, i) => ({
    name: formatLabel(item.x),
    value: item.y,
    color: COLORS[i % COLORS.length],
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
      </div>
      
      {chartData.length > 0 ? (
        <div className="flex items-center gap-6">
          <div className="w-40 h-40 relative shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                  isAnimationActive={true}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                {/* No Tooltip */}
              </PieChart>
            </ResponsiveContainer>
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-slate-900">{total.toLocaleString('pt-BR')}</span>
            </div>
          </div>
          <div className="flex-1 space-y-3 min-w-0">
            {chartData.map((item, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-2 min-w-0">
                  <div 
                    className="w-3 h-3 rounded-full shrink-0" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-slate-700 truncate" title={item.name}>
                    {item.name}
                  </span>
                </div>
                <div className="text-right pl-2">
                  <span className="text-sm font-bold text-slate-900 block">
                    {item.value.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-1 rounded">
                    {((item.value / total) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-400 text-center py-12">Nenhum dado disponível</p>
      )}
    </div>
  );
}

// Horizontal bar chart (Custom HTML/CSS implementation to avoid tooltips)
function BarChartCard({ 
  title, 
  subtitle,
  data, 
  icon: Icon,
  formatLabel = (x: string) => x
}: { 
  title: string; 
  subtitle?: string;
  data: MetricData[]; 
  icon: React.ElementType;
  formatLabel?: (x: string) => string;
}) {
  const chartData = data.slice(0, 10);
  const maxValue = Math.max(...chartData.map(d => d.y), 1);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
      </div>
      
      {chartData.length > 0 ? (
        <div className="space-y-4">
            {chartData.map((item, i) => {
                 const percentage = (item.y / maxValue) * 100;
                 const label = formatLabel(item.x);
                 const isUnknown = label === 'Desconhecido' || label === 'Unknown' || !label;
                 
                 return (
                    <div key={i} className="p-3 mb-2 rounded-lg bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-slate-700 truncate pr-4 flex items-center gap-2" title={label}>
                                {isUnknown && <span className="text-slate-400 font-bold">?</span>}
                                {label}
                            </span>
                            <span className="font-bold text-slate-900">
                                {item.y.toLocaleString('pt-BR')}
                            </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-100">
                             <div 
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${percentage}%` }}
                             />
                        </div>
                    </div>
                 )
            })}
        </div>
      ) : (
        <p className="text-sm text-slate-400 text-center py-12">Nenhum dado disponível</p>
      )}
    </div>
  );
}

// Country flags mapping
const countryFlags: Record<string, string> = {
  BR: '🇧🇷', US: '🇺🇸', PT: '🇵🇹', AR: '🇦🇷', MX: '🇲🇽',
  ES: '🇪🇸', CO: '🇨🇴', CL: '🇨🇱', PE: '🇵🇪', UY: '🇺🇾',
  GB: '🇬🇧', DE: '🇩🇪', FR: '🇫🇷', IT: '🇮🇹', CA: '🇨🇦',
  JP: '🇯🇵', CN: '🇨🇳', IN: '🇮🇳', AU: '🇦🇺', RU: '🇷🇺',
  NL: '🇳🇱', BE: '🇧🇪', CH: '🇨🇭', AT: '🇦🇹', SE: '🇸🇪',
  NO: '🇳🇴', DK: '🇩🇰', FI: '🇫🇮', PL: '🇵🇱', IE: '🇮🇪',
};

function getFlag(code: string): string {
  return countryFlags[code] || '🌍';
}

// Premium Countries Card component
function CountriesCard({ 
  data 
}: { 
  data: MetricData[]; 
}) {
  const total = data.reduce((sum, item) => sum + item.y, 0);
  const maxValue = Math.max(...data.map(d => d.y), 1);

  // Color gradient based on rank
  const getProgressColor = (index: number) => {
    const colors = [
      'from-blue-500 to-indigo-600',
      'from-emerald-500 to-teal-600',
      'from-orange-500 to-amber-600',
      'from-purple-500 to-pink-600',
      'from-cyan-500 to-blue-600',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Países</h3>
            <p className="text-sm text-slate-500">Distribuição geográfica</p>
          </div>
        </div>
        {total > 0 && (
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900">{total.toLocaleString('pt-BR')}</p>
            <p className="text-xs text-slate-500">visitantes totais</p>
          </div>
        )}
      </div>
      
      {data.length > 0 ? (
        <div className="space-y-4">
          {data.slice(0, 8).map((item, i) => {
            const percentage = (item.y / total) * 100;
            const widthPercentage = (item.y / maxValue) * 100;
            
            return (
              <div key={i} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getFlag(item.x)}</span>
                    <div>
                      <span className="text-sm font-medium text-slate-900">
                        {getCountryName(item.x)}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">
                        {item.x}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900">
                      {item.y.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">
                      ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${getProgressColor(i)} rounded-full transition-all duration-500 group-hover:opacity-80`}
                    style={{ width: `${widthPercentage}%` }}
                  />
                </div>
              </div>
            );
          })}
          
          {data.length > 8 && (
            <p className="text-xs text-slate-400 text-center pt-2">
              +{data.length - 8} outros países
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-slate-400 text-center py-12">Nenhum dado disponível</p>
      )}
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
      const res = await fetch(`/api/admin/analytics/audiencia?period=${period}`);
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

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Audiência</h1>
          <p className="text-slate-500 mt-1">Quem são os visitantes do seu site</p>
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
          <p className="text-slate-500 mt-1">Quem são os visitantes do seu site</p>
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
          <h1 className="text-2xl font-bold text-slate-900">Perfil da Audiência</h1>
          <p className="text-slate-500 mt-1">Entenda quem são seus visitantes</p>
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

      {/* Devices and Browsers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartCard 
          title="Dispositivos" 
          subtitle="Desktop vs Mobile vs Tablet"
          data={data?.devices || []}
          icon={Monitor}
          formatLabel={(x) => {
            const name = x.toLowerCase();
            if (name === 'desktop' || name === 'laptop') return 'Computador';
            if (name === 'mobile') return 'Móvel';
            return x.charAt(0).toUpperCase() + x.slice(1);
          }}
        />
        <PieChartCard 
          title="Navegadores" 
          subtitle="Navegadores mais usados"
          data={data?.browsers || []}
          icon={Chrome}
        />
      </div>

      {/* OS */}
      <PieChartCard 
        title="Sistemas Operacionais" 
        subtitle="Windows, Mac, iOS, Android, etc."
        data={data?.os || []}
        icon={ComputerIcon}
      />

      {/* Countries and Cities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
           <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Mapa Global</h3>
              <p className="text-sm text-slate-500">Distribuição geográfica</p>
            </div>
          </div>
          <div className="flex-1 min-h-[400px]">
             <MapWithNoSSR data={data?.countries || []} />
          </div>
        </div>

        <BarChartCard 
          title="Cidades" 
          subtitle="Principais cidades"
          data={data?.cities || []}
          icon={MapPin}
          formatLabel={(x) => x || 'Desconhecido'}
        />
      </div>

      {/* Languages and Screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartCard 
          title="Idiomas" 
          subtitle="Idiomas dos navegadores"
          data={data?.languages || []}
          icon={Languages}
        />
        <PieChartCard 
          title="Resoluções de Tela" 
          subtitle="Tamanhos de tela mais comuns"
          data={data?.screens || []}
          icon={Layout}
        />
      </div>
    </div>
  );
}
