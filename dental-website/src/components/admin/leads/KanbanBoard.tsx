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
  defaultDropAnimationSideEffects,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LeadCard } from './LeadCard';
import { updateLeadStatus } from '@/app/actions/leads';

type Lead = any; // Ideally import Lead type

const COLUMNS = {
  new: 'Novos',
  contacted: 'Contactados',
  qualified: 'Qualificados',
  converted: 'Convertidos',
};

// Update SortableLead to accept onClick
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

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3">
       <div 
         className="cursor-grab active:cursor-grabbing"
         onClick={onClick} // Handle click
       >
         {/* Render a simplified card for the board to save space, or full card */}
         <div className="bg-white p-3 rounded-lg border shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-gray-900 truncate flex-1">{lead.name}</h4>
                <div className="text-[10px] text-blue-500 font-bold opacity-0 group-hover:opacity-100">
                    VER
                </div>
            </div>
            <p className="text-xs text-gray-500 mb-2 truncate">{lead.email}</p>
            <div className="flex justify-between items-center text-xs">
                 <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{lead.treatment}</span>
                 <span className="text-gray-400">{new Date(lead.createdAt).toLocaleDateString()}</span>
            </div>
         </div>
       </div>
    </div>
  );
}

function Column({ id, title, leads, onLeadClick }: { id: string, title: string, leads: Lead[], onLeadClick: (lead: Lead) => void }) {
  const { setNodeRef } = useSortable({ id: id, data: { type: 'Column' } });
  
  return (
    <div ref={setNodeRef} className="bg-gray-100 rounded-xl p-4 min-w-[280px] w-full flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-700">{title}</h3>
        <span className="bg-white text-gray-600 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
            {leads.length}
        </span>
      </div>
      <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 overflow-y-auto min-h-[500px]">
            {leads.map(lead => (
                <SortableLead key={lead.id} lead={lead} onClick={() => onLeadClick(lead)} />
            ))}
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

  // Group leads by status
  const columns = Object.keys(COLUMNS) as Array<keyof typeof COLUMNS>;
  const leadsByStatus = columns.reduce((acc, status) => {
    acc[status] = leads.filter(l => l.status === status);
    return acc;
  }, {} as Record<string, Lead[]>);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    // Logic for reordering within same column or moving to another (visual only)
    const { active, over } = event;
    if (!over) return;
    
    // In this simplified version we just handle drag end to update status
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;

    // Find the container column
    const activeLead = leads.find(l => l.id === active.id);
    if (!activeLead) return;

    // If dropped over a column container or an item in a column
    let overStatus = over.data.current?.lead?.status || over.id;
    
    // If over is a column ID directly (when empty)
    if (Object.keys(COLUMNS).includes(over.id as string)) {
        overStatus = over.id;
    } else {
        // If over another item, find that item's status
        const overLead = leads.find(l => l.id === over.id);
        if (overLead) overStatus = overLead.status;
    }

    if (activeLead.status !== overStatus && Object.keys(COLUMNS).includes(overStatus)) {
        // Optimistic update
        const updatedLeads = leads.map(l => 
            l.id === activeLead.id ? { ...l, status: overStatus } : l
        );
        setLeads(updatedLeads);

        // Server action
        const formData = new FormData();
        formData.append('id', activeLead.id);
        formData.append('status', overStatus);
        updateLeadStatus(formData); // Fire and forget (or handle error)
    }
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full overflow-x-auto pb-4">
        {columns.map(status => (
            <Column 
                key={status} 
                id={status} 
                title={COLUMNS[status]} 
                leads={leadsByStatus[status]} 
                onLeadClick={onLeadClick}
            />
        ))}
      </div>
      
      <DragOverlay>
        {activeId ? (
            <div className="bg-white p-3 rounded-lg border shadow-xl rotate-3 cursor-grabbing opacity-90 w-[250px]">
                <h4 className="font-semibold text-gray-900">Moving Lead...</h4>
            </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
