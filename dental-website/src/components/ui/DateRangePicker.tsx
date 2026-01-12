'use client';

import { useState, useRef, useEffect } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, X } from 'lucide-react';
import 'react-day-picker/style.css';

interface DateRangePickerProps {
  from?: Date;
  to?: Date;
  onChange: (range: { from?: Date; to?: Date }) => void;
  placeholder?: string;
}

export function DateRangePicker({ 
  from, 
  to, 
  onChange, 
  placeholder = "Selecionar período" 
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(
    from || to ? { from, to } : undefined
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (newRange: DateRange | undefined) => {
    setRange(newRange);
    if (newRange?.from && newRange?.to) {
      onChange({ from: newRange.from, to: newRange.to });
      setIsOpen(false);
    } else if (newRange?.from && !newRange?.to) {
      // Still selecting, keep open
    } else {
      onChange({ from: undefined, to: undefined });
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRange(undefined);
    onChange({ from: undefined, to: undefined });
  };

  const displayValue = range?.from
    ? range.to
      ? `${format(range.from, 'dd/MM/yy')} - ${format(range.to, 'dd/MM/yy')}`
      : format(range.from, 'dd/MM/yyyy')
    : placeholder;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 text-sm rounded-lg border
          bg-white hover:bg-gray-50 transition-colors w-full justify-between
          ${range?.from ? 'border-blue-300 text-gray-900' : 'border-gray-300 text-gray-500'}
          focus:outline-none focus:ring-2 focus:ring-blue-500
        `}
      >
        <span className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{displayValue}</span>
        </span>
        {range?.from && (
          <button
            onClick={handleClear}
            className="p-0.5 hover:bg-gray-200 rounded"
          >
            <X className="w-3 h-3 text-gray-400" />
          </button>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 left-0">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleSelect}
            locale={ptBR}
            showOutsideDays
            numberOfMonths={1}
            disabled={{ after: new Date() }}
            classNames={{
              root: 'text-sm',
              months: 'flex flex-col',
              month: 'space-y-4',
              caption: 'flex justify-center pt-1 relative items-center',
              caption_label: 'text-sm font-medium text-gray-900',
              nav: 'space-x-1 flex items-center',
              nav_button: 'h-7 w-7 bg-transparent p-0 hover:bg-gray-100 rounded-lg transition-colors inline-flex items-center justify-center',
              nav_button_previous: 'absolute left-1',
              nav_button_next: 'absolute right-1',
              table: 'w-full border-collapse space-y-1',
              head_row: 'flex',
              head_cell: 'text-gray-500 rounded-md w-9 font-normal text-[0.8rem]',
              row: 'flex w-full mt-2',
              cell: 'text-center text-sm p-0 relative',
              day: 'h-9 w-9 p-0 font-normal rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center',
              day_selected: 'bg-blue-600 text-white hover:bg-blue-700',
              day_today: 'bg-gray-100 font-semibold',
              day_outside: 'text-gray-300',
              day_disabled: 'text-gray-300 cursor-not-allowed',
              day_range_middle: 'bg-blue-50 text-blue-900 rounded-none',
              day_range_start: 'rounded-r-none',
              day_range_end: 'rounded-l-none',
            }}
          />
          <div className="flex justify-end gap-2 pt-3 mt-3 border-t">
            <button
              type="button"
              onClick={() => {
                setRange(undefined);
                onChange({ from: undefined, to: undefined });
                setIsOpen(false);
              }}
              className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Limpar
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 text-xs bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
