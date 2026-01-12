import { useState, useTransition, useEffect } from 'react';
import { X, MessageCircle, Calendar, Phone, Mail, Loader2, Send, StickyNote, User, Trash2, UserCheck, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';
import { updateLeadStatus, addLeadNote, deleteLead } from '@/app/actions/leads';
import { assignLead, getUsers } from '@/app/actions/assign-lead';

interface LeadDetailsSidebarProps {
  lead: any;
  isOpen: boolean;
  onClose: () => void;
}

export function LeadDetailsSidebar({ lead, isOpen, onClose }: LeadDetailsSidebarProps) {
  const [isPending, startTransition] = useTransition();
  const [newNote, setNewNote] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [users, setUsers] = useState<{ id: string; name: string | null; email: string }[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    getUsers().then((res) => {
      if (res.success && res.users) {
        setUsers(res.users);
      }
    });
  }, []);
  
  useEffect(() => {
    if (lead) {
      setConfirmDelete(false);
    }
  }, [lead]);

  const handleAssign = (userId: string) => {
    setIsAssigning(true);
    startTransition(async () => {
      await assignLead(lead.id, userId || null);
      setIsAssigning(false);
    });
  };

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

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const startTime = tomorrow.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const endTime = new Date(tomorrow.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
  
  const calendarLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=Consulta: ${lead.name}&details=Tratamento: ${lead.treatment}%0AContato: ${lead.phone}&dates=${startTime}/${endTime}`;

  const statusConfig = {
    new: { gradient: 'bg-gradient-to-r from-blue-500 to-indigo-600', label: 'Novo' },
    contacted: { gradient: 'bg-gradient-to-r from-amber-400 to-orange-500', label: 'Contactado' },
    qualified: { gradient: 'bg-gradient-to-r from-purple-400 to-violet-500', label: 'Qualificado' },
    converted: { gradient: 'bg-gradient-to-r from-emerald-400 to-green-600', label: 'Convertido' },
  };

  const formatInTimeZone = (date: Date | string, fmt: string) => {
    const timeZone = 'America/Sao_Paulo';
    const zonedDate = toZonedTime(date, timeZone);
    return format(zonedDate, fmt, { locale: ptBR });
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-slate-200 flex flex-col">
       {/* Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-gradient-to-r from-slate-50 to-white shrink-0">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/25">
            {lead.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{lead.name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <select
                disabled={isPending}
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer focus:ring-2 focus:ring-offset-2 focus:outline-none shadow-lg text-white ${
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
        </div>
        <button 
          onClick={onClose} 
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
           <a href={whatsappLink} target="_blank" rel="noopener noreferrer" 
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-2 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-emerald-800 text-sm">WhatsApp</span>
           </a>
           <a href={calendarLink} target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-2 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-blue-800 text-sm">Agendar</span>
           </a>
        </div>

        {/* Lead Assignment */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-purple-500" />
            Atribuição
          </h3>
          <div className="flex items-center gap-3">
            <select
              value={lead.assignedToId || ''}
              onChange={(e) => handleAssign(e.target.value)}
              disabled={isAssigning}
              className="flex-1 px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 font-medium"
            >
              <option value="">Não atribuído</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
            {isAssigning && <Loader2 className="w-4 h-4 animate-spin text-purple-600" />}
          </div>
          {lead.assignedTo && (
            <p className="text-xs text-slate-500 mt-2">
              Atribuído em {lead.assignedAt ? formatInTimeZone(lead.assignedAt, "dd/MM/yyyy 'às' HH:mm") : ''}
            </p>
          )}
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl p-4 border-2 border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            Dados de Contato
          </h3>
          <div className="space-y-3">
            <a href={`mailto:${lead.email}`} className="flex items-center gap-3 px-3 py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl transition-colors group">
              <Mail className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
              <span className="text-sm text-slate-700 group-hover:text-blue-600">{lead.email}</span>
              <ExternalLink className="w-3 h-3 text-slate-300 ml-auto" />
            </a>
            <a href={`tel:${lead.phone}`} className="flex items-center gap-3 px-3 py-2 bg-slate-50 hover:bg-green-50 border border-slate-200 hover:border-green-200 rounded-xl transition-colors group">
              <Phone className="w-4 h-4 text-slate-400 group-hover:text-green-500" />
              <span className="text-sm text-slate-700 group-hover:text-green-600">{lead.phone}</span>
              <ExternalLink className="w-3 h-3 text-slate-300 ml-auto" />
            </a>
            <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs font-bold text-slate-500 uppercase">Tratamento</span>
              <span className="text-sm font-semibold text-slate-700">{lead.treatment}</span>
            </div>

            {/* Acquisition Channel */}
            {(lead.utmSource || lead.utmCampaign || lead.utmMedium) && (
              <div className="pt-3 mt-3 border-t border-dashed border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase mb-3">Canal de Aquisição</p>
                <div className="flex flex-wrap gap-2">
                  {lead.utmSource && (
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium border border-blue-200">
                      {(lead.utmSource === 'contact_page' || lead.utmSource === 'contact-page') ? 'Página de Contato' :
                       lead.utmSource === 'homepage' ? 'Página Inicial' :
                       lead.utmSource === 'botox-bruxismo' ? 'Botox para Bruxismo' :
                       lead.utmSource === 'placa-miorrelaxante' ? 'Placa Miorrelaxante' :
                       lead.utmSource === 'tratamento-bruxismo' ? 'Tratamento de Bruxismo' :
                       lead.utmSource}
                    </span>
                  )}
                  {lead.utmMedium && (
                    <span className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs rounded-lg font-medium border border-purple-200">
                      {lead.utmMedium === 'direct' ? 'Tráfego Direto' : lead.utmMedium}
                    </span>
                  )}
                  {lead.utmCampaign && (
                    <span className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs rounded-lg font-medium border border-amber-200">
                      {lead.utmCampaign}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notes System */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <StickyNote className="w-4 h-4 text-amber-500" />
            Notas e Histórico
          </h3>

          {/* Initial Message */}
          {lead.message && (
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-500 uppercase">Mensagem Inicial</span>
              </div>
              <p className="text-slate-700 text-sm italic leading-relaxed">"{lead.message}"</p>
            </div>
          )}

          {/* New Note Input */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-4 border-2 border-amber-200">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Escreva uma nova anotação sobre este lead..."
              className="w-full bg-white border-2 border-amber-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm resize-none placeholder-amber-400 text-slate-800 min-h-[80px]"
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-amber-600 font-medium">Visível apenas internamente</span>
              <Button 
                size="sm" 
                onClick={handleAddNote} 
                disabled={isPending || !newNote.trim()}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
              >
                Adicionar Nota <Send className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>

          {/* Timeline Feed */}
          <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 pb-4">
            
            {/* Render New LeadNotes */}
            {lead.leadNotes && lead.leadNotes.map((note: any) => (
              <div key={note.id} className="relative pl-8 group">
                <div className="absolute -left-[13px] top-0 w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                  <StickyNote className="w-3 h-3 text-white" />
                </div>

                <div className="bg-white p-4 rounded-xl border-2 border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg">
                      <User className="w-3 h-3" /> {note.user?.name || note.createdBy || 'Equipe'}
                    </span>
                    <time className="text-xs text-slate-400 font-medium">
                      {formatInTimeZone(note.createdAt, "dd MMM 'às' HH:mm")}
                    </time>
                  </div>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Legacy Note */}
            {lead.notes && (
              <div className="relative pl-8 opacity-60">
                <div className="absolute -left-[13px] top-0 w-7 h-7 bg-slate-200 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                  <StickyNote className="w-3 h-3 text-slate-500" />
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border-2 border-dashed border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase">Nota Anterior (Legado)</span>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap mt-2">{lead.notes}</p>
                </div>
              </div>
            )}

            {/* History Events */}
            {lead.history && lead.history.map((item: any) => (
              <div key={item.id} className="relative pl-8 opacity-50 hover:opacity-80 transition-opacity">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-300 border-2 border-white"></div>
                
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-slate-600">
                      {item.action === 'STATUS_CHANGE' ? 'Alteração de Status' : 
                       item.action === 'ALTERAÇÃO_DE_STATUS' ? 'Alteração de Status' :
                       item.action === 'NOTE_UPDATED' ? 'Nota Atualizada' :
                       item.action === 'NOTA_ATUALIZADA' ? 'Nota Atualizada' :
                       item.action === 'NOTA_ADICIONADA' ? 'Nota Adicionada' :
                       item.action}
                       
                       {item.user?.name && (
                          <span className="font-normal text-slate-400 ml-1">
                              por {item.user.name.split(' ')[0]}
                          </span>
                       )}
                    </span>
                    <span className="text-xs text-slate-400">
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
        <div className="pt-6 border-t border-slate-200">
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={isDeleting || isPending}
            className={`w-full rounded-xl ${confirmDelete ? 'bg-red-50 text-red-600 border-2 border-red-300 hover:bg-red-100' : 'text-slate-400 border-2 border-slate-200 hover:text-red-500 hover:border-red-200'}`}
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            {confirmDelete ? 'Confirmar Exclusão?' : 'Excluir este Lead'}
          </Button>
          {confirmDelete && (
            <p className="text-xs text-red-400 text-center mt-2 font-medium">
              Esta ação não pode ser desfeita.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
