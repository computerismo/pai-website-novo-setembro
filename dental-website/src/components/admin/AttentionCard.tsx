'use client';

import Link from 'next/link';
import { AlertTriangle, Clock, ChevronRight, CheckCircle, Zap } from 'lucide-react';

interface AttentionCardProps {
  count: number;
  leads: { id: string; name: string; createdAt: Date }[];
}

export function AttentionCard({ count, leads }: AttentionCardProps) {
  if (count === 0) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-lg shadow-emerald-500/20">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            <CheckCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Tudo em dia!</h3>
            <p className="text-emerald-100 mt-1">Nenhum lead aguardando atendimento</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-red-500 via-rose-500 to-orange-500 rounded-2xl p-6 shadow-lg shadow-red-500/25 h-full flex flex-col">
      {/* Animated background pulse */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center animate-pulse">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Leads Aguardando</h3>
              <p className="text-red-100 mt-0.5">
                {count} lead{count !== 1 ? 's' : ''} sem contato há +24h
              </p>
            </div>
          </div>
          <span className="text-4xl font-black text-white drop-shadow-lg">{count}</span>
        </div>

        {/* Recent stale leads preview */}
        {leads.length > 0 && (
          <div className="space-y-2 mb-5">
            {leads.slice(0, 3).map((lead) => {
              const hoursAgo = Math.floor(
                (Date.now() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60)
              );
              const daysAgo = Math.floor(hoursAgo / 24);

              return (
                <div key={lead.id} className="flex items-center justify-between text-sm bg-white/15 backdrop-blur rounded-xl px-4 py-3">
                  <span className="font-semibold text-white">{lead.name}</span>
                  <span className="text-red-100 flex items-center gap-1.5 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    {daysAgo > 0 ? `${daysAgo}d` : `${hoursAgo}h`}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <Link
          href="/admin/leads?status=new"
          className="flex items-center justify-center gap-2 w-full py-3 bg-white text-red-600 text-sm font-bold rounded-xl hover:bg-red-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Ver todos os leads novos
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
