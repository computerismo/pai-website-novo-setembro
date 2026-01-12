'use client';

import { useState } from 'react';
import { X, Trash2, RefreshCw, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { bulkUpdateLeadStatus, bulkDeleteLeads } from '@/app/actions/assign-lead';
import { exportLeadsToCSV } from '@/app/actions/lead-history';

interface BulkActionsBarProps {
  selectedIds: string[];
  onClearSelection: () => void;
  totalCount: number;
}

export function BulkActionsBar({ selectedIds, onClearSelection, totalCount }: BulkActionsBarProps) {
  const [isPending, setIsPending] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (selectedIds.length === 0) return null;

  const handleStatusChange = async (status: string) => {
    setIsPending(true);
    await bulkUpdateLeadStatus(selectedIds, status);
    onClearSelection();
    setIsPending(false);
  };

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    setIsPending(true);
    await bulkDeleteLeads(selectedIds);
    onClearSelection();
    setIsPending(false);
    setShowDeleteConfirm(false);
  };

  const handleExport = async () => {
    setIsPending(true);
    const result = await exportLeadsToCSV();
    if (result.success && result.csv) {
      // Filter to only selected leads would require backend change
      // For now, export all and note selected count
      const blob = new Blob([result.csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-selecionados-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
    setIsPending(false);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-gray-900 text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-6 animate-in slide-in-from-bottom duration-300">
      {/* Selection info */}
      <div className="flex items-center gap-3">
        <button
          onClick={onClearSelection}
          className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <span className="font-medium">
          {selectedIds.length} de {totalCount} selecionados
        </span>
      </div>

      <div className="w-px h-8 bg-gray-700" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Status change dropdown */}
        <select
          disabled={isPending}
          onChange={(e) => e.target.value && handleStatusChange(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          defaultValue=""
        >
          <option value="" disabled>Alterar status...</option>
          <option value="new">Novo</option>
          <option value="contacted">Contactado</option>
          <option value="qualified">Qualificado</option>
          <option value="converted">Convertido</option>
        </select>

        {/* Export */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExport}
          disabled={isPending}
          className="text-white hover:bg-gray-700"
        >
          <Download className="w-4 h-4 mr-1" />
          Exportar
        </Button>

        {/* Delete */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
          className={`${showDeleteConfirm ? 'bg-red-600 hover:bg-red-700' : 'text-red-400 hover:bg-red-900/30'}`}
        >
          {showDeleteConfirm ? (
            <>
              <Trash2 className="w-4 h-4 mr-1" />
              Confirmar?
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4 mr-1" />
              Excluir
            </>
          )}
        </Button>
      </div>

      {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
    </div>
  );
}
