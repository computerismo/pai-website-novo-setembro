'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Search, Download, X, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { exportLeadsToCSV } from '@/app/actions/lead-history';

interface LeadFiltersProps {
  viewMode: 'list' | 'board';
  onViewChange: (mode: 'list' | 'board') => void;
  treatments?: string[];
  utmSources?: string[];
}

const STATUS_OPTIONS = [
  { value: '', label: 'Todos os Status' },
  { value: 'new', label: 'Novo' },
  { value: 'contacted', label: 'Contactado' },
  { value: 'qualified', label: 'Qualificado' },
  { value: 'converted', label: 'Convertido' },
];

export function LeadFilters({ 
  viewMode, 
  onViewChange,
  treatments = [],
  utmSources = [],
}: LeadFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize state from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [treatment, setTreatment] = useState(searchParams.get('treatment') || '');
  const [utmSource, setUtmSource] = useState(searchParams.get('source') || '');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    searchParams.get('from') ? new Date(searchParams.get('from')!) : undefined
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(
    searchParams.get('to') ? new Date(searchParams.get('to')!) : undefined
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Check if any filters are active
  const hasActiveFilters = status || treatment || utmSource || dateFrom || dateTo;

  // Debounced URL update
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (status) params.set('status', status);
    if (treatment) params.set('treatment', treatment);
    if (utmSource) params.set('source', utmSource);
    if (dateFrom) params.set('from', dateFrom.toISOString().split('T')[0]);
    if (dateTo) params.set('to', dateTo.toISOString().split('T')[0]);
    
    router.replace(`?${params.toString()}`);
  }, [searchTerm, status, treatment, utmSource, dateFrom, dateTo, router]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      updateUrl();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, updateUrl]);

  // Update URL immediately for other filters
  useEffect(() => {
    updateUrl();
  }, [status, treatment, utmSource, dateFrom, dateTo, updateUrl]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatus('');
    setTreatment('');
    setUtmSource('');
    setDateFrom(undefined);
    setDateTo(undefined);
    router.replace('?');
  };

  const handleExport = async () => {
    const result = await exportLeadsToCSV();
    if (result.success && result.csv) {
      const blob = new Blob([result.csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      alert('Erro ao exportar leads');
    }
  };

  // Dynamic treatment options
  const treatmentOptions = [
    { value: '', label: 'Todos os Tratamentos' },
    ...treatments.map(t => ({ value: t, label: t })),
  ];

  // Dynamic UTM source options
  const sourceOptions = [
    { value: '', label: 'Todas as Origens' },
    ...utmSources.map(s => ({ 
      value: s, 
      label: s === 'contact-page' || s === 'contact_page' ? 'Página de Contato' :
             s === 'homepage' ? 'Página Inicial' :
             s === 'botox-bruxismo' ? 'Botox para Bruxismo' :
             s === 'placa-miorrelaxante' ? 'Placa Miorrelaxante' :
             s === 'tratamento-bruxismo' ? 'Tratamento de Bruxismo' :
             s
    })),
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      {/* Main filter bar */}
      <div className="p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {/* Search */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por nome, email, telefone..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Toggle advanced filters */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg border transition-colors ${
              showAdvanced || hasActiveFilters
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtros</span>
            {hasActiveFilters && (
              <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {[status, treatment, utmSource, dateFrom].filter(Boolean).length}
              </span>
            )}
            <ChevronDown className={`w-3 h-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* View toggle & Export */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => onViewChange('list')}
              className={`px-4 py-2 rounded-md transition-all text-sm font-medium ${
                viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => onViewChange('board')}
              className={`px-4 py-2 rounded-md transition-all text-sm font-medium ${
                viewMode === 'board' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Kanban
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
        </div>
      </div>

      {/* Advanced filters panel */}
      {showAdvanced && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-100 bg-gray-50/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {/* Status filter */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Treatment filter */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Tratamento</label>
              <select
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {treatmentOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* UTM Source filter */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Origem</label>
              <select
                value={utmSource}
                onChange={(e) => setUtmSource(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sourceOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Date range filter */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Período</label>
              <DateRangePicker
                from={dateFrom}
                to={dateTo}
                onChange={({ from, to }) => {
                  setDateFrom(from);
                  setDateTo(to);
                }}
                placeholder="Selecionar período"
              />
            </div>
          </div>

          {/* Clear filters button */}
          {hasActiveFilters && (
            <div className="flex justify-end mt-4">
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-3 h-3" />
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
