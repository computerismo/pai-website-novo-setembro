'use client';

import { useState, useTransition } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Mail,
  Phone,
  Tag,
  MessageSquare,
  Loader2,
  ChevronDown,
  ChevronUp,
  User,
  Clock
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

  const statusConfig = {
    new: { gradient: 'bg-gradient-to-r from-blue-500 to-indigo-600', label: 'Novo' },
    contacted: { gradient: 'bg-gradient-to-r from-amber-400 to-orange-500', label: 'Contactado' },
    qualified: { gradient: 'bg-gradient-to-r from-cyan-400 to-teal-500', label: 'Qualificado' },
    converted: { gradient: 'bg-gradient-to-r from-emerald-400 to-green-600', label: 'Convertido' },
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
    <div className={`p-5 transition-all duration-200 group relative ${isSelected ? 'bg-blue-50/80 ring-2 ring-blue-400 ring-inset' : 'hover:bg-slate-50/50'}`}>
      <div className="flex flex-col gap-4">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {onToggleSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={onToggleSelect}
                onClick={(e) => e.stopPropagation()}
                className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            )}
            
            {/* Avatar */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20 flex-shrink-0">
              {lead.name.charAt(0).toUpperCase()}
            </div>
            
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900">{lead.name}</h3>
                {lead.assignedTo && (
                  <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-lg font-medium">
                    <User className="w-3 h-3" />
                    {lead.assignedTo.name || lead.assignedTo.email}
                  </span>
                )}
                {onSelect && (
                  <button 
                    onClick={onSelect}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    Ver Detalhes →
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                {format(new Date(lead.createdAt), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}
              </div>
            </div>
          </div>
          
          {/* Status */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <select
              disabled={isPending}
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer focus:ring-2 focus:ring-offset-2 focus:outline-none shadow-lg text-white ${
                statusConfig[lead.status as keyof typeof statusConfig]?.gradient || 'bg-slate-400'
              }`}
              style={{ colorScheme: 'light' }}
            >
              <option value="new" className="text-slate-900 bg-white">Novo</option>
              <option value="contacted" className="text-slate-900 bg-white">Contactado</option>
              <option value="qualified" className="text-slate-900 bg-white">Qualificado</option>
              <option value="converted" className="text-slate-900 bg-white">Convertido</option>
            </select>
            {isPending && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
          </div>
        </div>

        {/* Contact Details */}
        <div className="flex flex-wrap gap-3 ml-16">
          <a 
            href={`mailto:${lead.email}`} 
            className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl text-sm text-slate-700 hover:text-blue-600 transition-colors"
          >
            <Mail className="w-4 h-4 text-slate-400" />
            {lead.email}
          </a>
          <a 
            href={`tel:${lead.phone}`} 
            className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-green-50 border border-slate-200 hover:border-green-200 rounded-xl text-sm text-slate-700 hover:text-green-600 transition-colors"
          >
            <Phone className="w-4 h-4 text-slate-400" />
            {lead.phone}
          </a>
          <span className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-700">
            <Tag className="w-4 h-4 text-slate-400" />
            {lead.treatment}
          </span>
        </div>

        {/* Message Preview */}
        {lead.message && (
          <div className="ml-16 text-sm bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-700 block mb-1">Mensagem:</span>
            <p className="text-slate-600">{lead.message}</p>
          </div>
        )}

        {/* Internal Notes Section */}
        <div className="ml-16 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold text-amber-700 uppercase tracking-wide flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Anotações Internas
            </label>
            {!isEditingNotes && (
               <button 
                 onClick={() => setIsEditingNotes(true)}
                 className="text-xs text-amber-700 hover:text-amber-900 font-semibold px-3 py-1 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
               >
                 Editar
               </button>
            )}
          </div>
          
          {isEditingNotes ? (
            <div className="space-y-3">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-sm p-3 border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none bg-white"
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
                  className="text-slate-600"
                >
                  Cancelar
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSaveNotes}
                  disabled={isPending}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
                >
                  {isPending ? 'Salvando...' : 'Salvar Nota'}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-700 min-h-[1.5rem] whitespace-pre-wrap">
              {lead.notes || <span className="text-amber-600/60 italic">Nenhuma anotação...</span>}
            </p>
          )}
        </div>

        {/* UTM / Tracking Info (Collapsible) */}
        {(lead.utmSource || lead.utmMedium || lead.utmCampaign) && (
          <div className="ml-16 border-t border-slate-200 pt-3">
             <button 
               onClick={() => setIsExpanded(!isExpanded)}
               className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600 transition-colors font-medium"
             >
               {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
               Dados de Rastreamento
             </button>
             
             {isExpanded && (
                <div className="mt-3 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  {lead.utmSource && (
                    <span className="px-3 py-1.5 bg-white text-slate-600 text-xs rounded-lg border border-slate-200 shadow-sm">
                      Origem: <b className="text-slate-800">
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
                    <span className="px-3 py-1.5 bg-white text-slate-600 text-xs rounded-lg border border-slate-200 shadow-sm">
                      Meio: <b className="text-slate-800">{lead.utmMedium === 'direct' ? 'Tráfego Direto' : lead.utmMedium}</b>
                    </span>
                  )}
                  {lead.utmCampaign && (
                    <span className="px-3 py-1.5 bg-white text-slate-600 text-xs rounded-lg border border-slate-200 shadow-sm">
                      Campanha: <b className="text-slate-800">{lead.utmCampaign}</b>
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
