'use client';

import { Filter, TrendingUp } from 'lucide-react';

interface FunnelStage {
  label: string;
  count: number;
  color: string;
}

interface ConversionFunnelProps {
  stages: FunnelStage[];
}

const gradientColors: Record<string, string> = {
  'bg-blue-500': 'from-blue-500 to-indigo-600',
  'bg-yellow-500': 'from-amber-400 to-orange-500',
  'bg-cyan-500': 'from-cyan-400 to-teal-500',
  'bg-green-500': 'from-emerald-400 to-green-600',
};

export function ConversionFunnel({ stages }: ConversionFunnelProps) {
  const total = stages.length > 0 ? stages[0].count : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/25">
          <Filter className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Funil de Conversão</h3>
          <p className="text-sm text-slate-500">Pipeline de leads</p>
        </div>
      </div>

      <div className="space-y-5">
        {stages.map((stage, index) => {
          const percentage = total > 0 ? (stage.count / total) * 100 : 0;
          const conversionFromPrev = index > 0 && stages[index - 1].count > 0
            ? ((stage.count / stages[index - 1].count) * 100).toFixed(0)
            : null;
          const gradient = gradientColors[stage.color] || 'from-slate-400 to-slate-500';

          return (
            <div key={stage.label} className="relative group">
              {/* Conversion arrow */}
              {index > 0 && conversionFromPrev && (
                <div className="absolute -top-3.5 left-32 text-xs text-slate-400 flex items-center gap-1 opacity-60">
                  <span className="text-[10px]">↓</span>
                  <span className="font-medium">{conversionFromPrev}%</span>
                </div>
              )}

              {/* Bar */}
              <div className="flex items-center gap-4">
                <div className="w-28 text-sm font-medium text-slate-600 text-right shrink-0">
                  {stage.label}
                </div>
                <div className="flex-1 h-12 bg-slate-100 rounded-xl overflow-hidden relative">
                  <div
                    className={`h-full bg-gradient-to-r ${gradient} transition-all duration-700 rounded-xl flex items-center px-4 group-hover:shadow-lg`}
                    style={{ width: `${Math.max(percentage, 8)}%` }}
                  >
                    {percentage > 15 && (
                      <span className="text-white text-sm font-bold drop-shadow">
                        {stage.count}
                      </span>
                    )}
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                  {percentage <= 15 && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700 text-sm font-bold">
                      {stage.count}
                    </span>
                  )}
                </div>
                <div className="w-14 text-sm font-medium text-slate-500 shrink-0">
                  {percentage.toFixed(0)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {stages.length >= 2 && (
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-3">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <p className="text-sm text-slate-600">
            Taxa de conversão total:{' '}
            <span className="font-bold text-emerald-600 text-lg">
              {total > 0 ? ((stages[stages.length - 1].count / total) * 100).toFixed(1) : 0}%
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
