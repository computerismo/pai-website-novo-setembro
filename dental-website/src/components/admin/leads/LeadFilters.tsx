'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, Download, LayoutGrid, List as ListIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { exportLeadsToCSV } from '@/app/actions/lead-history';

interface LeadFiltersProps {
  viewMode: 'list' | 'board';
  onViewChange: (mode: 'list' | 'board') => void;
}

export function LeadFilters({ viewMode, onViewChange }: LeadFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    router.replace(`?${params.toString()}`);
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

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por nome, email..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue={searchParams.get('q')?.toString()}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
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
          Exportar CSV
        </Button>
      </div>
    </div>
  );
}
