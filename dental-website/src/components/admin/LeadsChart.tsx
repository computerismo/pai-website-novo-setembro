'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrendingUp, BarChart3 } from 'lucide-react';

interface LeadsChartProps {
  data: { date: string; count: number }[];
}

export function LeadsChart({ data }: LeadsChartProps) {
  const { maxCount, chartData } = useMemo(() => {
    const max = Math.max(...data.map(d => d.count), 1);
    return {
      maxCount: max,
      chartData: data,
    };
  }, [data]);

  const totalLeads = data.reduce((sum, d) => sum + d.count, 0);
  const avgLeads = data.length > 0 ? (totalLeads / data.length).toFixed(1) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Leads nos Últimos 7 Dias</h3>
          </div>
          <p className="text-sm text-slate-500">
            Acompanhe o desempenho da geração de leads
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900">{totalLeads}</p>
            <p className="text-xs text-slate-500">total</p>
          </div>
          <div className="text-right px-4 border-l border-slate-200">
            <p className="text-2xl font-bold text-blue-600">{avgLeads}</p>
            <p className="text-xs text-slate-500">média/dia</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-52">
        {/* Background grid */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-t border-slate-100 border-dashed" />
          ))}
        </div>

        <div className="absolute inset-0 flex items-end justify-between gap-3 px-2">
          {chartData.map((item, index) => {
            const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
            const dateLabel = format(new Date(item.date), 'EEE', { locale: ptBR });
            const dayLabel = format(new Date(item.date), 'dd/MM');
            const isToday = index === chartData.length - 1;
            
            return (
              <div key={item.date} className="flex-1 flex flex-col items-center group cursor-pointer">
                {/* Tooltip */}
                <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10 transform group-hover:-translate-y-1">
                  <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-xl whitespace-nowrap">
                    <p className="font-semibold">{item.count} lead{item.count !== 1 ? 's' : ''}</p>
                    <p className="text-slate-400 text-[10px]">{dayLabel}</p>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full flex justify-center mb-3 flex-1 items-end relative">
                  {/* Number badge - always visible */}
                  <span className={`absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-bold px-2 py-0.5 rounded-lg ${
                    isToday 
                      ? 'text-white bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/30' 
                      : item.count > 0 
                        ? 'text-slate-700 bg-white shadow-sm border border-slate-200' 
                        : 'text-slate-400 bg-slate-100'
                  }`}>
                    {item.count}
                  </span>
                  
                  <div
                    className={`w-full max-w-14 rounded-xl transition-all duration-500 relative overflow-hidden ${
                      isToday 
                        ? 'bg-gradient-to-t from-blue-600 via-blue-500 to-indigo-400 shadow-lg shadow-blue-500/30' 
                        : 'bg-gradient-to-t from-slate-300 to-slate-200 group-hover:from-blue-500 group-hover:to-blue-400'
                    }`}
                    style={{ 
                      height: `${Math.max(height, 8)}%`,
                      minHeight: item.count > 0 ? '24px' : '8px'
                    }}
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </div>
                </div>

                {/* Label */}
                <span className={`text-xs font-medium capitalize ${
                  isToday ? 'text-blue-600' : 'text-slate-400'
                }`}>{dateLabel}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
