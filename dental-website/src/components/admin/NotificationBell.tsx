'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Bell, RefreshCw, X, Clock, ChevronRight } from 'lucide-react';
import { getNewLeadsCount } from '@/app/actions/get-new-leads-count';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

const POLL_INTERVAL = 30 * 60 * 1000; // 30 minutes
const STORAGE_KEY = 'admin_leads_last_seen';

interface RecentLead {
  id: string;
  name: string;
  email: string;
  treatment: string;
  status: string;
  createdAt: Date;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getLastSeen = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored || null;
  }, []);

  const fetchNewLeads = useCallback(async (isManual = false) => {
    if (isManual) setIsLoading(true);
    
    try {
      const lastSeen = getLastSeen();
      const result = await getNewLeadsCount(lastSeen || undefined);
      
      if (result.success) {
        setNewCount(result.count);
        setRecentLeads(result.recentLeads as RecentLead[]);
        setLastChecked(new Date());
      }
    } catch (error) {
      console.error('Error fetching new leads:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getLastSeen]);

  const markAsRead = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    setNewCount(0);
    setIsOpen(false);
  }, []);

  useEffect(() => {
    fetchNewLeads();
    const interval = setInterval(() => fetchNewLeads(), POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchNewLeads]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusConfig: Record<string, { gradient: string; label: string }> = {
    new: { gradient: 'bg-gradient-to-r from-blue-500 to-indigo-500', label: 'Novo' },
    contacted: { gradient: 'bg-gradient-to-r from-amber-400 to-orange-500', label: 'Contactado' },
    qualified: { gradient: 'bg-gradient-to-r from-cyan-400 to-teal-500', label: 'Qualificado' },
    converted: { gradient: 'bg-gradient-to-r from-emerald-400 to-green-500', label: 'Convertido' },
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-200"
        aria-label="Notificações de leads"
      >
        <Bell className="w-5 h-5" />
        
        {newCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-[10px] font-bold text-white bg-gradient-to-r from-red-500 to-rose-500 rounded-full shadow-lg shadow-red-500/30 animate-pulse">
            {newCount > 99 ? '99+' : newCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-200/60 z-50 overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">Novos Leads</h3>
              {newCount > 0 && (
                <p className="text-xs text-slate-500">{newCount} aguardando atenção</p>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => fetchNewLeads(true)}
                disabled={isLoading}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                title="Atualizar"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-80 overflow-y-auto p-3 space-y-2 bg-slate-50/50">
            {recentLeads.length === 0 ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">Tudo em dia!</p>
                <p className="text-xs text-slate-400 mt-1">Nenhum lead aguardando</p>
              </div>
            ) : (
              recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads?q=${encodeURIComponent(lead.email)}`}
                  className="block p-3 bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl transition-all duration-200 group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20 text-white font-bold text-sm">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {lead.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-500 truncate max-w-[120px]">
                            {lead.treatment}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(lead.createdAt), "dd/MM HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[10px] px-2 py-1 rounded-lg font-semibold text-white shadow-sm ${statusConfig[lead.status]?.gradient || 'bg-slate-400'}`}>
                        {statusConfig[lead.status]?.label || lead.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-100 bg-white flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {lastChecked && `Atualizado ${format(lastChecked, 'HH:mm')}`}
            </span>
            <div className="flex gap-3">
              {newCount > 0 && (
                <button
                  onClick={markAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Marcar como lido
                </button>
              )}
              <Link
                href="/admin/leads"
                className="flex items-center gap-1 text-xs font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-3 py-1.5 rounded-lg shadow-lg shadow-amber-500/20 transition-all"
                onClick={() => setIsOpen(false)}
              >
                Ver todos
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
