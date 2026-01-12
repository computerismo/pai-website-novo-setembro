'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { LeadCard } from './LeadCard';
import { KanbanBoard } from './KanbanBoard';
import { LeadFilters } from './LeadFilters';
import { LeadDetailsSidebar } from './LeadDetailsSidebar';
import { BulkActionsBar } from './BulkActionsBar';

interface LeadsContainerProps {
  leads: any[];
  treatments?: string[];
  utmSources?: string[];
}

export function LeadsContainer({ leads, treatments = [], utmSources = [] }: LeadsContainerProps) {
  const searchParams = useSearchParams();
  const viewParam = searchParams.get('view');
  
  const [viewMode, setViewMode] = useState<'list' | 'board'>(
    viewParam === 'kanban' ? 'board' : 'list'
  );
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Sync view mode with URL param
  useEffect(() => {
    if (viewParam === 'kanban') {
      setViewMode('board');
    } else if (viewParam === 'list') {
      setViewMode('list');
    }
  }, [viewParam]);

  const selectedLead = leads.find(l => l.id === selectedLeadId) || null;

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === leads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(leads.map(l => l.id)));
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-6">
      <LeadFilters 
        viewMode={viewMode} 
        onViewChange={setViewMode}
        treatments={treatments}
        utmSources={utmSources}
      />

      {viewMode === 'list' ? (
         <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div className="flex items-center gap-4">
                {leads.length > 0 && (
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 px-2 py-1 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === leads.length && leads.length > 0}
                      onChange={selectAll}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-600">Selecionar todos</span>
                  </label>
                )}
                <h2 className="text-lg font-semibold text-slate-900">
                  Todos os Leads
                </h2>
              </div>
              <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {leads.length} leads
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {leads.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 font-medium">Nenhum lead encontrado</p>
                  <p className="text-sm text-slate-400 mt-1">Tente ajustar os filtros ou aguarde novos contatos</p>
                </div>
              ) : (
                leads.map((lead) => (
                  <LeadCard 
                    key={lead.id} 
                    lead={lead} 
                    onSelect={() => setSelectedLeadId(lead.id)}
                    isSelected={selectedIds.has(lead.id)}
                    onToggleSelect={() => toggleSelection(lead.id)}
                  />
                ))
              )}
            </div>
         </div>
      ) : (
        <div className="h-[calc(100vh-250px)] min-h-[500px]">
           <KanbanBoard 
              leads={leads} 
              onLeadClick={(lead) => setSelectedLeadId(lead.id)} 
           />
        </div>
      )}

      <LeadDetailsSidebar 
        lead={selectedLead} 
        isOpen={!!selectedLead} 
        onClose={() => setSelectedLeadId(null)} 
      />

      <BulkActionsBar
        selectedIds={Array.from(selectedIds)}
        onClearSelection={clearSelection}
        totalCount={leads.length}
      />
    </div>
  );
}
