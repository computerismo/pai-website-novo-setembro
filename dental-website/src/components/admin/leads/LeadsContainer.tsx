'use client';

import { useState } from 'react';
import { LeadCard } from './LeadCard';
import { KanbanBoard } from './KanbanBoard';
import { LeadFilters } from './LeadFilters';
import { LeadDetailsSidebar } from './LeadDetailsSidebar';

interface LeadsContainerProps {
  leads: any[];
  treatments?: string[];
  utmSources?: string[];
}

export function LeadsContainer({ leads, treatments = [], utmSources = [] }: LeadsContainerProps) {
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const selectedLead = leads.find(l => l.id === selectedLeadId) || null;

  return (
    <div className="space-y-6">
      <LeadFilters 
        viewMode={viewMode} 
        onViewChange={setViewMode}
        treatments={treatments}
        utmSources={utmSources}
      />

      {viewMode === 'list' ? (
         <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Todos os Leads
              </h2>
              <span className="text-sm text-gray-500">
                {leads.length} leads encontrados
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {leads.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  Nenhum lead encontrado
                </div>
              ) : (
                leads.map((lead) => (
                  <LeadCard 
                    key={lead.id} 
                    lead={lead} 
                    onSelect={() => setSelectedLeadId(lead.id)} 
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
    </div>
  );
}
