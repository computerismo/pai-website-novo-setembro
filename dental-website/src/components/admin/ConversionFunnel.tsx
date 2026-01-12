'use client';

interface FunnelStage {
  label: string;
  count: number;
  color: string;
}

interface ConversionFunnelProps {
  stages: FunnelStage[];
}

export function ConversionFunnel({ stages }: ConversionFunnelProps) {
  const total = stages.length > 0 ? stages[0].count : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Funil de Conversão</h3>

      <div className="space-y-4">
        {stages.map((stage, index) => {
          const percentage = total > 0 ? (stage.count / total) * 100 : 0;
          const conversionFromPrev = index > 0 && stages[index - 1].count > 0
            ? ((stage.count / stages[index - 1].count) * 100).toFixed(0)
            : null;

          return (
            <div key={stage.label} className="relative">
              {/* Conversion arrow */}
              {index > 0 && conversionFromPrev && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 flex items-center gap-1">
                  <span className="text-[10px]">↓</span>
                  <span className="font-medium">{conversionFromPrev}%</span>
                </div>
              )}

              {/* Bar */}
              <div className="flex items-center gap-4">
                <div className="w-28 text-sm font-medium text-gray-700 text-right shrink-0">
                  {stage.label}
                </div>
                <div className="flex-1 h-10 bg-gray-100 rounded-lg overflow-hidden relative">
                  <div
                    className={`h-full ${stage.color} transition-all duration-500 rounded-lg flex items-center justify-center`}
                    style={{ width: `${Math.max(percentage, 8)}%` }}
                  >
                    {percentage > 20 && (
                      <span className="text-white text-sm font-bold">
                        {stage.count}
                      </span>
                    )}
                  </div>
                  {percentage <= 20 && (
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600 text-sm font-bold">
                      {stage.count}
                    </span>
                  )}
                </div>
                <div className="w-14 text-sm text-gray-500 shrink-0">
                  {percentage.toFixed(0)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {stages.length >= 2 && (
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Taxa de conversão total:{' '}
            <span className="font-bold text-green-600">
              {total > 0 ? ((stages[stages.length - 1].count / total) * 100).toFixed(1) : 0}%
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
