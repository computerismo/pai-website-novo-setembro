'use client';

import { useState, useEffect } from 'react';
import { 
  Globe, 
  Link as LinkIcon,
  Search,
  Share2,
  RefreshCw,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import Link from 'next/link';
import { getChannels, getReferrers, type ChannelsResponse, type ReferrersResponse } from '@/lib/analytics/ga4-api';

const PERIODS = [
  { value: '24h', label: 'Últimas 24h' },
  { value: '7d', label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
  { value: '90d', label: 'Últimos 90 dias' },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

interface AcquisitionData {
  channels: ChannelsResponse['channels'];
  referrers: ReferrersResponse['referrers'];
  period: string;
}

// Channel icons and colors
const channelConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  'Direct': { icon: Globe, color: '#3b82f6', label: 'Tráfego Direto' },
  'Organic Search': { icon: Search, color: '#10b981', label: 'Busca Orgânica' },
  'Referral': { icon: LinkIcon, color: '#f59e0b', label: 'Referência' },
  'Organic Social': { icon: Share2, color: '#ec4899', label: 'Redes Sociais' },
  'Paid Search': { icon: TrendingUp, color: '#ef4444', label: 'Busca Paga' },
  'Email': { icon: Globe, color: '#8b5cf6', label: 'Email Marketing' },
  'Unassigned': { icon: Globe, color: '#94a3b8', label: 'Não Atribuído' },
};

function getChannelLabel(channel: string): string {
  return channelConfig[channel]?.label || channel;
}

// Referrer display name translations
function getReferrerDisplayName(referrer: string): string {
  if (!referrer || referrer === '(not set)') return 'Desconhecido';
  if (referrer === '(direct)') return 'Direto';
  if (referrer === 'google') return 'Google';
  if (referrer === 'facebook') return 'Facebook';
  if (referrer === 'instagram') return 'Instagram';
  if (referrer === 'twitter') return 'Twitter';
  if (referrer === 'linkedin') return 'LinkedIn';
  return referrer;
}

// Semantic colors for referrers (matching channel colors)
function getReferrerColor(referrer: string): string {
  const lowerRef = referrer?.toLowerCase() || '';
  
  // Direct traffic - Blue (like Direct channel)
  if (lowerRef === '(direct)' || !referrer) return '#3b82f6';
  
  // Search engines - Green (like Organic Search channel)
  if (lowerRef === 'google' || lowerRef.includes('bing') || lowerRef.includes('yahoo') || 
      lowerRef.includes('duckduckgo') || lowerRef.includes('baidu')) return '#10b981';
  
  // Social media - Pink (like Organic Social channel)
  if (lowerRef === 'facebook' || lowerRef.includes('facebook') ||
      lowerRef === 'instagram' || lowerRef.includes('instagram') ||
      lowerRef === 'twitter' || lowerRef.includes('twitter') ||
      lowerRef === 'linkedin' || lowerRef.includes('linkedin') ||
      lowerRef.includes('tiktok') || lowerRef.includes('pinterest')) return '#ec4899';
  
  // Unknown/Not set - Gray (like Unassigned channel)
  if (lowerRef === '(not set)' || lowerRef === 'not set') return '#94a3b8';
  
  // Other referrals - Orange (like Referral channel)
  return '#f59e0b';
}

// Filter out debug/testing referrers
function filterDebugReferrers(referrers: Array<{ x: string; y: number }>): Array<{ x: string; y: number }> {
  const debugDomains = [
    'tagassistant.google.com',
    'gtm-msr.appspot.com',
    'localhost',
    '127.0.0.1',
  ];
  return referrers.filter(r => !debugDomains.some(d => r.x?.includes(d)));
}

// Data table with progress bars
function DataTable({ 
  title, 
  subtitle,
  data, 
  icon: Icon,
  iconColor = 'blue',
}: { 
  title: string; 
  subtitle?: string;
  data: Array<{ x: string; y: number }>; 
  icon: React.ElementType;
  iconColor?: string;
}) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-emerald-100 text-emerald-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  // Filter debug referrers and translate names
  const filteredData = filterDebugReferrers(data);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2.5 rounded-xl ${colorMap[iconColor]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredData.slice(0, 15).map((item, i) => {
          const maxValue = filteredData[0]?.y || 1;
          const percentage = (item.y / maxValue) * 100;
          const barColor = getReferrerColor(item.x);
          
          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-sm text-slate-700 truncate" title={item.x}>
                    {getReferrerDisplayName(item.x)}
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-900 ml-2 shrink-0">
                  {item.y.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%`, backgroundColor: barColor }}
                />
              </div>
            </div>
          );
        })}
        {filteredData.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-12">Nenhum dado disponível</p>
        )}
      </div>
    </div>
  );
}

// Channel overview card
function ChannelOverview({ data }: { data: Array<{ x: string; y: number; users: number }> }) {
  const chartData = data.slice(0, 6).map((item, i) => ({
    name: getChannelLabel(item.x),
    value: item.y,
    color: channelConfig[item.x]?.color || COLORS[i % COLORS.length],
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Canais de Aquisição</h3>
          <p className="text-sm text-slate-500">Como os visitantes encontram seu site</p>
        </div>
      </div>
      
      {chartData.length > 0 ? (
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="w-64 h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                  isAnimationActive={true}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-3xl font-bold text-slate-900">{total.toLocaleString('pt-BR')}</span>
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Sessões</span>
            </div>
          </div>
          
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {chartData.map((item, i) => {
              const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
              const config = Object.entries(channelConfig).find(([key]) => 
                getChannelLabel(key) === item.name
              );
              const Icon = config?.[1]?.icon || Globe;
              
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: item.color }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-bold text-slate-900">{item.name}</p>
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-100">
                        {percentage}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                       <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: item.color }} />
                       </div>
                       <p className="text-xs text-slate-500 font-medium">
                        {item.value.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-400 text-center py-12">Nenhum dado disponível</p>
      )}
    </div>
  );
}

export default function AquisicaoPage() {
  const [data, setData] = useState<AcquisitionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('7d');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [channelsRes, referrersRes] = await Promise.all([
        getChannels(period),
        getReferrers(period),
      ]);
      
      setData({
        channels: channelsRes.channels,
        referrers: referrersRes.referrers,
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
          <h1 className="text-2xl font-bold text-slate-900">Aquisição</h1>
          <p className="text-slate-500 mt-1">De onde vêm seus visitantes</p>
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
          <h1 className="text-2xl font-bold text-slate-900">Aquisição</h1>
          <p className="text-slate-500 mt-1">De onde vêm seus visitantes</p>
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
            <span className="text-slate-900 font-medium">Aquisição</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Fontes de Tráfego</h1>
          <p className="text-slate-500 mt-1">Descubra de onde vêm seus visitantes</p>
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

      {/* Channels Overview */}
      <ChannelOverview data={data?.channels || []} />

      {/* Referrers */}
      <DataTable 
        title="Sites de Referência" 
        subtitle="Sites que enviam tráfego para você"
        data={data?.referrers || []}
        icon={LinkIcon}
        iconColor="orange"
      />
    </div>
  );
}
