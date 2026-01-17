
'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { SeoHistoryPoint } from '@/lib/types/seo';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PerformanceChartProps {
  data: SeoHistoryPoint[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Desempenho de Pesquisa</h3>
        <p className="text-sm text-slate-500">
          Cliques vs Impressões ao longo do tempo
        </p>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => format(parseISO(value), 'dd/MM', { locale: ptBR })}
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis 
              yAxisId="left"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Cliques', angle: -90, position: 'insideLeft', style: { fill: '#3b82f6', fontSize: 12 } }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Impressões', angle: 90, position: 'insideRight', style: { fill: '#8b5cf6', fontSize: 12 } }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                padding: '12px'
              }}
              labelFormatter={(value) => format(parseISO(value), 'dd MMMM yyyy', { locale: ptBR })}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="clicks"
              name="Cliques"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="impressions"
              name="Impressões"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
