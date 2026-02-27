'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, ChevronDown } from 'lucide-react';

export function SeoDateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const days = searchParams.get('days') || '28';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('days', value);
    } else {
      params.delete('days');
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const options = [
    { value: '7', label: 'Últimos 7 dias' },
    { value: '28', label: 'Últimos 28 dias' },
    { value: '90', label: 'Últimos 3 meses' },
    { value: '180', label: 'Últimos 6 meses' },
    { value: '365', label: 'Últimos 12 meses' },
  ];

  return (
    <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1 pl-3 shadow-sm hover:border-slate-300 transition-colors">
      <Calendar className="w-4 h-4 text-slate-400" />
      <div className="relative flex items-center">
        <select
          value={days}
          onChange={handleChange}
          className="appearance-none bg-transparent text-sm font-medium text-slate-600 focus:outline-none py-1.5 pr-8 pl-1 border-none cursor-pointer"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-1 pointer-events-none" />
      </div>
    </div>
  );
}
