'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { updateLeadStatus } from '@/app/actions/leads';

type Lead = any;

const COLUMNS = {
  new: { label: 'Novos', gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-100/80', border: 'border-blue-300/60', empty: 'bg-blue-50' },
  contacted: { label: 'Contactados', gradient: 'from-amber-400 to-orange-500', bg: 'bg-amber-100/80', border: 'border-amber-300/60', empty: 'bg-amber-50' },
  qualified: { label: 'Qualificados', gradient: 'from-purple-400 to-violet-500', bg: 'bg-purple-100/80', border: 'border-purple-300/60', empty: 'bg-purple-50' },
  converted: { label: 'Convertidos', gradient: 'from-emerald-400 to-green-600', bg: 'bg-emerald-100/80', border: 'border-emerald-300/60', empty: 'bg-emerald-50' },
};

function SortableLead({ lead, onClick }: { lead: Lead, onClick: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: lead.id, data: { lead } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Map UTM source to readable label
  const getSourceLabel = (source: string | null) => {
    if (!source) return null;
    const sourceMap: Record<string, string> = {
      'contact_page': 'Contato',
      'contact-page': 'Contato',
      'homepage': 'Home',
      'botox-bruxismo': 'Botox',
      'placa-miorrelaxante': 'Placa',
      'tratamento-bruxismo': 'Bruxismo',
      'google': 'Google',
      'facebook': 'Facebook',
      'instagram': 'Instagram',
      'direct': 'Direto',
    };
    return sourceMap[source] || source;
  };

  const sourceLabel = getSourceLabel(lead.utmSource);

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3">
       <div 
         className="cursor-grab active:cursor-grabbing"
         onClick={onClick}
       >
         <div className="bg-gradient-to-br from-white to-slate-50 p-4 rounded-xl border-2 border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-300/60 transition-all duration-200 group">
            {/* Header with avatar and name */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20 flex-shrink-0">
                {lead.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{lead.name}</h4>
                <p className="text-xs text-slate-400 truncate">{lead.email}</p>
              </div>
              <div className="text-[10px] text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-blue-100 px-2 py-1 rounded-lg flex-shrink-0">
                VER
              </div>
            </div>
            
            {/* Info row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold truncate max-w-[100px]">
                {lead.treatment}
              </span>
              {sourceLabel && (
                <span className="bg-purple-50 text-purple-600 px-2.5 py-1 rounded-lg text-xs font-semibold border border-purple-200">
                  {sourceLabel}
                </span>
              )}
              <span className="text-xs text-slate-400 ml-auto flex-shrink-0">
                {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
            
            {/* Assigned user */}
            {lead.assignedTo && (
              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                  {lead.assignedTo.name?.charAt(0) || 'A'}
                </div>
                <span className="text-xs text-slate-500 font-medium truncate">{lead.assignedTo.name || lead.assignedTo.email}</span>
              </div>
            )}
         </div>
       </div>
    </div>
  );
}

function Column({ id, title, leads, onLeadClick, config }: { id: string, title: string, leads: Lead[], onLeadClick: (lead: Lead) => void, config: typeof COLUMNS[keyof typeof COLUMNS] }) {
  const { setNodeRef } = useSortable({ id: id, data: { type: 'Column' } });
  
  return (
    <div ref={setNodeRef} className={`${config.bg} rounded-2xl p-4 min-w-[280px] w-full flex flex-col h-full border ${config.border}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.gradient}`} />
          <h3 className="font-bold text-slate-700">{title}</h3>
        </div>
        <span className={`bg-gradient-to-r ${config.gradient} text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm`}>
            {leads.length}
        </span>
      </div>
      <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 overflow-y-auto min-h-[400px] max-h-[600px] space-y-0">
            {leads.length === 0 ? (
              <div className={`h-32 flex items-center justify-center border-2 border-dashed rounded-xl ${config.border} ${config.empty}`}>
                <p className="text-sm text-slate-400 font-medium">Arraste leads aqui</p>
              </div>
            ) : (
              leads.map(lead => (
                <SortableLead key={lead.id} lead={lead} onClick={() => onLeadClick(lead)} />
              ))
            )}
        </div>
      </SortableContext>
    </div>
  );
}

export function KanbanBoard({ leads: initialLeads, onLeadClick }: { leads: Lead[], onLeadClick: (lead: Lead) => void }) {
  const [leads, setLeads] = useState(initialLeads);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 8,
        },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columns = Object.keys(COLUMNS) as Array<keyof typeof COLUMNS>;
  const leadsByStatus = columns.reduce((acc, status) => {
    acc[status] = leads.filter(l => l.status === status);
    return acc;
  }, {} as Record<string, Lead[]>);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    // Visual feedback only
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;

    const activeLead = leads.find(l => l.id === active.id);
    if (!activeLead) return;

    let overStatus = over.data.current?.lead?.status || over.id;
    
    if (Object.keys(COLUMNS).includes(over.id as string)) {
        overStatus = over.id;
    } else {
        const overLead = leads.find(l => l.id === over.id);
        if (overLead) overStatus = overLead.status;
    }

    if (activeLead.status !== overStatus && Object.keys(COLUMNS).includes(overStatus)) {
        const updatedLeads = leads.map(l => 
            l.id === activeLead.id ? { ...l, status: overStatus } : l
        );
        setLeads(updatedLeads);

        const formData = new FormData();
        formData.append('id', activeLead.id);
        formData.append('status', overStatus);
        updateLeadStatus(formData);
    }
  }

  const activeLead = activeId ? leads.find(l => l.id === activeId) : null;

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full overflow-x-auto pb-4">
        {columns.map(status => (
            <Column 
                key={status} 
                id={status} 
                title={COLUMNS[status].label} 
                leads={leadsByStatus[status]} 
                onLeadClick={onLeadClick}
                config={COLUMNS[status]}
            />
        ))}
      </div>
      
      <DragOverlay>
        {activeLead ? (
            <div className="bg-white p-4 rounded-xl border-2 border-blue-400 shadow-2xl rotate-2 cursor-grabbing w-[260px]">
                <h4 className="font-semibold text-slate-900">{activeLead.name}</h4>
                <p className="text-xs text-slate-500">{activeLead.email}</p>
            </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
