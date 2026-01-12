'use client';

import { useState, useTransition } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Mail,
  Phone,
  Calendar,
  Tag,
  MessageSquare,
  Save,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { updateLeadStatus, updateLeadNotes } from '@/app/actions/leads';
import { Button } from '@/components/ui/Button';

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  treatment: string;
  message: string | null;
  status: string;
  notes: string | null;
  createdAt: Date;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  assignedTo?: { id: string; name: string | null; email: string } | null;
};

interface LeadCardProps {
  lead: Lead;
  onSelect?: () => void;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export function LeadCard({ lead, onSelect, isSelected = false, onToggleSelect }: LeadCardProps) {
  const [isPending, startTransition] = useTransition();
  const [notes, setNotes] = useState(lead.notes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const statusGradients = {
    new: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
    contacted: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white',
    qualified: 'bg-gradient-to-r from-cyan-400 to-teal-500 text-white',
    converted: 'bg-gradient-to-r from-emerald-400 to-green-600 text-white',
  };

  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('id', lead.id);
      formData.append('status', newStatus);
      await updateLeadStatus(formData);
    });
  };

  const handleSaveNotes = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('id', lead.id);
      formData.append('notes', notes);
      await updateLeadNotes(formData);
      setIsEditingNotes(false);
    });
  };

  return (
    <div className={`p-5 bg-white hover:bg-slate-50/50 transition-all duration-200 group relative border-b border-slate-100 ${isSelected ? 'bg-blue-50/50 ring-2 ring-blue-300 ring-inset' : ''}`}>
      <div className="flex flex-col gap-4">
        {/* Top Row: Checkbox, Name and Status */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {onToggleSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={onToggleSelect}
                onClick={(e) => e.stopPropagation()}
                className="mt-1.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            )}
            <div>
              <div className="flex items-center gap-3">
                 <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                 {lead.assignedTo && (
                   <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                     {lead.assignedTo.name || lead.assignedTo.email}
                   </span>
                 )}
                 {onSelect && (
                   <button 
                    onClick={onSelect}
                    className="text-xs text-blue-600 hover:text-blue-800 underline font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                     Ver Detalhes
                   </button>
                 )}
              </div>
              <p className="text-sm text-gray-500">
                {format(new Date(lead.createdAt), "dd 'de' MMM 'às' HH:mm", {
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              disabled={isPending}
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold appearance-none cursor-pointer focus:ring-2 focus:ring-offset-1 focus:outline-none shadow-sm ${
                statusGradients[lead.status as keyof typeof statusGradients] || 'bg-slate-200 text-slate-700'
              }`}
            >
              <option value="new">Novo</option>
              <option value="contacted">Contactado</option>
              <option value="qualified">Qualificado</option>
              <option value="converted">Convertido</option>
            </select>
            {isPending && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
          </div>
        </div>

        {/* Contact Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4 text-gray-400" />
            <a href={`mailto:${lead.email}`} className="hover:text-blue-600 truncate">
              {lead.email}
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-gray-400" />
            <a href={`tel:${lead.phone}`} className="hover:text-blue-600">
              {lead.phone}
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Tag className="w-4 h-4 text-gray-400" />
            <span className="truncate">{lead.treatment}</span>
          </div>
        </div>

        {/* Message Preview */}
        {lead.message && (
          <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <span className="font-medium text-gray-900 block mb-1">Mensagem:</span>
            {lead.message}
          </div>
        )}

        {/* Internal Notes Section */}
        <div className="bg-yellow-50/50 p-3 rounded-lg border border-yellow-100">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-yellow-800 uppercase tracking-wide flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              Anotações Internas
            </label>
            {!isEditingNotes && (
               <button 
                 onClick={() => setIsEditingNotes(true)}
                 className="text-xs text-yellow-700 hover:text-yellow-900 font-medium underline"
               >
                 Editar
               </button>
            )}
          </div>
          
          {isEditingNotes ? (
            <div className="space-y-2">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-sm p-2 border border-yellow-300 rounded focus:ring-2 focus:ring-yellow-500 focus:outline-none bg-yellow-50"
                rows={3}
                placeholder="Adicione observações sobre este lead..."
              />
              <div className="flex justify-end gap-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => {
                    setIsEditingNotes(false);
                    setNotes(lead.notes || '');
                  }}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSaveNotes}
                  disabled={isPending}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  {isPending ? 'Salvando...' : 'Salvar Nota'}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-800 min-h-[1.5rem] whitespace-pre-wrap">
              {lead.notes || <span className="text-gray-400 italic">Nenhuma anotação...</span>}
            </p>
          )}
        </div>

        {/* UTM / Tracking Info (Collapsible) */}
        {(lead.utmSource || lead.utmMedium || lead.utmCampaign) && (
          <div className="border-t pt-2 mt-2">
             <button 
               onClick={() => setIsExpanded(!isExpanded)}
               className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
             >
               {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
               Dados de Rastreamento
             </button>
             
             {isExpanded && (
                <div className="mt-2 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  {lead.utmSource && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200">
                      Origem: <b>
                        {
                            (lead.utmSource === 'contact_page' || lead.utmSource === 'contact-page') ? 'Página de Contato' :
                            lead.utmSource === 'homepage' ? 'Página Inicial' :
                            lead.utmSource === 'botox-bruxismo' ? 'Botox para Bruxismo' :
                            lead.utmSource === 'placa-miorrelaxante' ? 'Placa Miorrelaxante' :
                            lead.utmSource === 'tratamento-bruxismo' ? 'Tratamento de Bruxismo' :
                            lead.utmSource
                        }
                      </b>
                    </span>
                  )}
                  {lead.utmMedium && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200">
                      Meio: <b>{lead.utmMedium === 'direct' ? 'Tráfego Direto' : lead.utmMedium}</b>
                    </span>
                  )}
                  {lead.utmCampaign && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200">
                      Campanha: <b>{lead.utmCampaign}</b>
                    </span>
                  )}
                </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
