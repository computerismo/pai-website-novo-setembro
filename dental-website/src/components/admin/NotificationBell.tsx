'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Bell, RefreshCw, X, User, Clock, ExternalLink } from 'lucide-react';
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

  // Get stored "last seen" timestamp
  const getLastSeen = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored || null;
  }, []);

  // Fetch new leads count
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

  // Mark as read
  const markAsRead = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    setNewCount(0);
    setIsOpen(false);
  }, []);

  // Initial fetch and polling
  useEffect(() => {
    fetchNewLeads();
    const interval = setInterval(() => fetchNewLeads(), POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchNewLeads]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    qualified: 'bg-cyan-100 text-cyan-700',
    converted: 'bg-green-100 text-green-700',
  };

  const statusLabels: Record<string, string> = {
    new: 'Novo',
    contacted: 'Contactado',
    qualified: 'Qualificado',
    converted: 'Convertido',
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Notificações de leads"
      >
        <Bell className="w-5 h-5" />
        
        {/* Badge */}
        {newCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full animate-pulse">
            {newCount > 99 ? '99+' : newCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 text-sm">Novos Leads</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchNewLeads(true)}
                disabled={isLoading}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                title="Atualizar"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-80 overflow-y-auto">
            {recentLeads.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>Nenhum lead recente</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentLeads.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/admin/leads?q=${encodeURIComponent(lead.email)}`}
                    className="block p-3 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {lead.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {lead.treatment}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${statusColors[lead.status] || 'bg-gray-100 text-gray-600'}`}>
                        {statusLabels[lead.status] || lead.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1.5 text-[10px] text-gray-400 ml-10">
                      <Clock className="w-3 h-3" />
                      <span>
                        {format(new Date(lead.createdAt), "dd MMM 'às' HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
            <span className="text-[10px] text-gray-400">
              {lastChecked && `Atualizado ${format(lastChecked, 'HH:mm')}`}
            </span>
            <div className="flex gap-2">
              {newCount > 0 && (
                <button
                  onClick={markAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Marcar como lido
                </button>
              )}
              <Link
                href="/admin/leads"
                className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Ver todos
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
