import { useState, useTransition, useEffect } from 'react';
import { X, MessageCircle, Calendar, History, Phone, Mail, Loader2, Save, Send, StickyNote, User, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';
import { updateLeadStatus, addLeadNote, deleteLead } from '@/app/actions/leads';

interface LeadDetailsSidebarProps {
  lead: any; // Ideally typed
  isOpen: boolean;
  onClose: () => void;
}

export function LeadDetailsSidebar({ lead, isOpen, onClose }: LeadDetailsSidebarProps) {
  const [isPending, startTransition] = useTransition();
  const [newNote, setNewNote] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // No longer need to sync legacy 'notes' state, as we are adding new ones.
  // Legacy notes will be displayed as a static item.
  
  // Reset confirmation state when lead changes
  useEffect(() => {
    if (lead) {
      setConfirmDelete(false);
    }
  }, [lead]);

  if (!isOpen || !lead) return null;

  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('id', lead.id);
      formData.append('status', newStatus);
      await updateLeadStatus(formData);
    });
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    startTransition(async () => {
      const formData = new FormData();
      formData.append('id', lead.id);
      formData.append('note', newNote);
      await addLeadNote(formData);
      setNewNote('');
    });
  };

  const handleDelete = () => {
    if (!confirmDelete) {
        setConfirmDelete(true);
        return;
    }

    setIsDeleting(true);
    startTransition(async () => {
        const res = await deleteLead(lead.id);
        if (res?.success) {
            onClose();
        }
        setIsDeleting(false);
    });
  };

  const whatsappLink = `https://wa.me/55${lead.phone.replace(/\D/g, '')}?text=Olá ${lead.name.split(' ')[0]}, tudo bem? Vi seu interesse em ${lead.treatment}...`;

  // Google Calendar Link
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const startTime = tomorrow.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const endTime = new Date(tomorrow.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
  
  const calendarLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=Consulta: ${lead.name}&details=Tratamento: ${lead.treatment}%0AContato: ${lead.phone}&dates=${startTime}/${endTime}`;

  const statusColors = {
    new: 'bg-blue-100 text-blue-800 border-blue-200',
    contacted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    qualified: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    converted: 'bg-green-100 text-green-800 border-green-200',
  };

  // Helper for timezone
  const formatInTimeZone = (date: Date | string, fmt: string) => {
    const timeZone = 'America/Sao_Paulo';
    const zonedDate = toZonedTime(date, timeZone);
    return format(zonedDate, fmt, { locale: ptBR });
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l flex flex-col">
       {/* Header */}
      <div className="p-6 border-b flex justify-between items-start bg-gray-50 shrink-0">
        <div>
           <h2 className="text-xl font-bold text-gray-900 line-clamp-1">{lead.name}</h2>
           
            <div className="flex items-center gap-2 mt-2">
                <select
                disabled={isPending}
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium border appearance-none cursor-pointer focus:ring-2 focus:ring-offset-1 focus:outline-none ${
                    statusColors[lead.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                }`}
                >
                <option value="new">Novo</option>
                <option value="contacted">Contactado</option>
                <option value="qualified">Qualificado</option>
                <option value="converted">Convertido</option>
                </select>
                {isPending && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
            </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
           <a href={whatsappLink} target="_blank" rel="noopener noreferrer" 
              className="flex flex-col items-center justify-center p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors group">
              <MessageCircle className="w-6 h-6 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-green-900 text-sm">WhatsApp</span>
           </a>
           <a href={calendarLink} target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors group">
              <Calendar className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-blue-900 text-sm">Agendar</span>
           </a>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
            <h3 className="font-bold text-gray-900 border-b pb-2">Dados de Contato</h3>
            <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                    <span className="font-medium text-xs bg-gray-100 px-2 py-1 rounded">Tratamento</span>
                    <span>{lead.treatment}</span>
                </div>

                {/* Acquisition Channel */}
                {(lead.utmSource || lead.utmCampaign || lead.utmMedium) && (
                    <div className="pt-2 mt-2 border-t border-dashed">
                        <p className="text-xs font-semibold text-gray-500 mb-2">Canal de Aquisição / Campanha</p>
                        <div className="space-y-1">
                            {lead.utmSource && (
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-400 text-xs w-16">Origem:</span>
                                    <span className="font-medium text-gray-700 bg-blue-50 px-2 py-0.5 rounded">
                                        {
                                            (lead.utmSource === 'contact_page' || lead.utmSource === 'contact-page') ? 'Página de Contato' :
                                            lead.utmSource === 'homepage' ? 'Página Inicial' :
                                            lead.utmSource === 'botox-bruxismo' ? 'Botox para Bruxismo' :
                                            lead.utmSource === 'placa-miorrelaxante' ? 'Placa Miorrelaxante' :
                                            lead.utmSource === 'tratamento-bruxismo' ? 'Tratamento de Bruxismo' :
                                            lead.utmSource
                                        }
                                    </span>
                                </div>
                            )}
                            {lead.utmMedium && (
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-400 text-xs w-16">Meio:</span>
                                    <span className="text-gray-700">
                                        {lead.utmMedium === 'direct' ? 'Tráfego Direto' : lead.utmMedium}
                                    </span>
                                </div>
                            )}
                            {lead.utmCampaign && (
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-400 text-xs w-16">Campanha:</span>
                                    <span className="text-gray-700">{lead.utmCampaign}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* --- NOTE SYSTEM --- */}
        <div className="space-y-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <StickyNote className="w-5 h-5" /> Notas e Histórico
            </h3>

            {/* 1. Initial Message (If exists) */}
            {lead.message && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm relative">
                    <div className="absolute top-4 left-4">
                        <MessageCircle className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="pl-8">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                            Mensagem Inicial do Paciente
                        </p>
                        <p className="text-gray-800 text-sm italic leading-relaxed">
                            "{lead.message}"
                        </p>
                    </div>
                </div>
            )}

            {/* 2. New Note Input */}
            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Escreva uma nova anotação sobre este lead..."
                    className="w-full bg-transparent border-none focus:ring-0 text-sm resize-none placeholder-yellow-700/50 text-gray-800 min-h-[60px]"
                />
                <div className="flex justify-between items-center mt-2 border-t border-yellow-200 pt-2">
                    <span className="text-xs text-yellow-700">Visível apenas internamente</span>
                    <Button 
                        size="sm" 
                        onClick={handleAddNote} 
                        disabled={isPending || !newNote.trim()}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white h-7 text-xs"
                    >
                        Adicionar Nota <Send className="w-3 h-3 ml-1" />
                    </Button>
                </div>
            </div>

            {/* 3. Timeline Feed */}
            <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-4">
                
                {/* Render New LeadNotes */}
                {lead.leadNotes && lead.leadNotes.map((note: any) => (
                    <div key={note.id} className="relative pl-8 group">
                         {/* Icon Bubble */}
                        <div className="absolute -left-[13px] top-0 w-7 h-7 bg-yellow-100 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                            <StickyNote className="w-3 h-3 text-yellow-600" />
                        </div>

                        {/* Content */}
                        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                                    <User className="w-3 h-3" /> {note.user?.name || note.createdBy || 'Equipe'}
                                </span>
                                <time className="text-[10px] text-gray-400 font-medium">
                                    {formatInTimeZone(note.createdAt, "dd MMM 'às' HH:mm")}
                                </time>
                            </div>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {note.content}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Legacy Note (If exists) */}
                {lead.notes && (
                     <div className="relative pl-8 opacity-75">
                        <div className="absolute -left-[13px] top-0 w-7 h-7 bg-gray-100 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                            <StickyNote className="w-3 h-3 text-gray-500" />
                        </div>
                         <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 border-dashed">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-gray-500">Nota Anterior (Legado)</span>
                            </div>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                {lead.notes}
                            </p>
                        </div>
                    </div>
                )}

                {/* History Events */}
                {lead.history && lead.history.map((item: any) => (
                    <div key={item.id} className="relative pl-8 opacity-60 hover:opacity-100 transition-opacity">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-200 border-2 border-white"></div>
                        
                        <div className="flex flex-col">
                             <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs font-semibold text-slate-700">
                                    {item.action === 'STATUS_CHANGE' ? 'Alteração de Status' : 
                                     item.action === 'ALTERAÇÃO_DE_STATUS' ? 'Alteração de Status' :
                                     item.action === 'NOTE_UPDATED' ? 'Nota Atualizada' :
                                     item.action === 'NOTA_ATUALIZADA' ? 'Nota Atualizada' :
                                     item.action === 'NOTA_ADICIONADA' ? 'Nota Adicionada' :
                                     item.action}
                                     
                                     {/* Display author if available */}
                                     {item.user?.name && (
                                        <span className="font-normal text-slate-400 ml-1">
                                            por {item.user.name.split(' ')[0]}
                                        </span>
                                     )}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                   {formatInTimeZone(item.createdAt, "dd MMM HH:mm")}
                                </span>
                             </div>
                             <p className="text-xs text-slate-500">
                                {(() => {
                                  let desc = item.description;
                                  const translations: Record<string, string> = {
                                    '"new"': '"Novo"',
                                    '"contacted"': '"Contactado"', 
                                    '"qualified"': '"Qualificado"',
                                    '"converted"': '"Convertido"',
                                    'Status alterado de': 'Status alterado de',
                                    ' para ': ' para '
                                  };
                                  Object.entries(translations).forEach(([eng, pt]) => {
                                    desc = desc.replace(eng, pt);
                                  });
                                  return desc;
                                })()}
                             </p>
                        </div>
                    </div>
                ))}
            
            </div>
        </div>

        {/* Delete Lead */}
       <div className="pt-8 border-t mt-8">
           <Button
               variant="outline"
               onClick={handleDelete}
               disabled={isDeleting || isPending}
               className={`w-full ${confirmDelete ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700' : 'text-gray-400 hover:text-red-500 hover:border-red-200'}`}
           >
               {isDeleting ? (
                   <Loader2 className="w-4 h-4 animate-spin mr-2" />
               ) : (
                   <Trash2 className="w-4 h-4 mr-2" />
               )}
               {confirmDelete ? 'Confirmar Exclusão?' : 'Excluir este Lead'}
           </Button>
           {confirmDelete && (
                <p className="text-xs text-red-400 text-center mt-2">
                    Esta ação não pode ser desfeita.
                </p>
           )}
       </div>

      </div>
    </div>
  );
}
