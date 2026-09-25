'use server';

import { prisma } from '@/lib/db';
import { authorizeServerAction } from '@/lib/security/authorization';
import { toCsv } from '@/lib/security/csv';
import { z } from 'zod';

const historySchema = z.object({
  leadId: z.string().min(1).max(128),
  action: z.string().trim().min(1).max(50),
  description: z.string().trim().min(1).max(500),
});

export async function logLeadHistory(leadId: string, action: string, description: string) {
  const actor = await authorizeServerAction('leads');
  if (!actor) return { success: false };
  const parsed = historySchema.safeParse({ leadId, action, description });
  if (!parsed.success) return { success: false };

  try {
    await prisma.leadHistory.create({
      data: {
        leadId: parsed.data.leadId,
        action: parsed.data.action,
        description: parsed.data.description,
        userId: actor.id,
        createdBy: actor.name || 'Admin',
      },
    });
    return { success: true };
  } catch {
    console.error('lead_history_write_failed');
    return { success: false };
  }
}

export async function exportLeadsToCSV() {
  const actor = await authorizeServerAction('leads');
  if (!actor) return { success: false, message: 'Não autorizado' };

  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10_000,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        treatment: true,
        message: true,
        status: true,
        notes: true,
        createdAt: true,
        utmSource: true,
        utmMedium: true,
        utmCampaign: true,
      },
    });

    const csv = toCsv(
      [
        'ID', 'Nome', 'Email', 'Telefone', 'Tratamento', 'Mensagem',
        'Status', 'Notas', 'Data Criação', 'UTM Source', 'UTM Medium', 'UTM Campaign',
      ],
      leads.map((lead) => [
        lead.id,
        lead.name,
        lead.email,
        lead.phone,
        lead.treatment,
        lead.message,
        lead.status,
        lead.notes,
        lead.createdAt,
        lead.utmSource,
        lead.utmMedium,
        lead.utmCampaign,
      ])
    );

    return { success: true, csv };
  } catch {
    console.error('lead_export_failed');
    return { success: false, message: 'Erro ao gerar CSV' };
  }
}
