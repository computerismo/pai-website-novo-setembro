'use client';

import { useMemo } from 'react';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Leads nos Últimos 7 Dias</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Total: <span className="font-medium text-gray-700">{totalLeads}</span> · 
            Média: <span className="font-medium text-gray-700">{avgLeads}/dia</span>
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-48">
        <div className="absolute inset-0 flex items-end justify-between gap-2">
          {chartData.map((item, index) => {
            const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
            const dateLabel = format(new Date(item.date), 'EEE', { locale: ptBR });
            const dayLabel = format(new Date(item.date), 'dd/MM');
            
            return (
              <div key={item.date} className="flex-1 flex flex-col items-center group">
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                    {item.count} lead{item.count !== 1 ? 's' : ''} em {dayLabel}
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full flex justify-center mb-2">
                  <div
                    className="w-full max-w-12 rounded-t-lg transition-all duration-300 bg-gradient-to-t from-blue-600 to-blue-400 group-hover:from-blue-700 group-hover:to-blue-500 relative"
                    style={{ height: `${Math.max(height, 4)}%` }}
                  >
                    {item.count > 0 && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700">
                        {item.count}
                      </span>
                    )}
                  </div>
                </div>

                {/* Label */}
                <span className="text-xs text-gray-500 capitalize">{dateLabel}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
