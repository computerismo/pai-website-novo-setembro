'use client';

import Link from 'next/link';
import { AlertTriangle, Clock, ChevronRight } from 'lucide-react';

interface AttentionCardProps {
  count: number;
  leads: { id: string; name: string; createdAt: Date }[];
}

export function AttentionCard({ count, leads }: AttentionCardProps) {
  if (count === 0) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-lg">✓</span>
          </div>
          <div>
            <h3 className="font-semibold text-green-800">Tudo em dia!</h3>
            <p className="text-sm text-green-600">Nenhum lead aguardando atendimento</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-red-800">Leads Aguardando</h3>
            <p className="text-sm text-red-600">
              {count} lead{count !== 1 ? 's' : ''} sem contato há +24h
            </p>
          </div>
        </div>
        <span className="text-3xl font-bold text-red-600">{count}</span>
      </div>

      {/* Recent stale leads preview */}
      {leads.length > 0 && (
        <div className="space-y-2 mb-4">
          {leads.slice(0, 3).map((lead) => {
            const hoursAgo = Math.floor(
              (Date.now() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60)
            );
            const daysAgo = Math.floor(hoursAgo / 24);

            return (
              <div key={lead.id} className="flex items-center justify-between text-sm bg-white/60 rounded-lg px-3 py-2">
                <span className="font-medium text-gray-800">{lead.name}</span>
                <span className="text-red-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {daysAgo > 0 ? `${daysAgo}d` : `${hoursAgo}h`}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <Link
        href="/admin/leads?status=new"
        className="flex items-center justify-center gap-2 w-full py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Ver todos os leads novos
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
