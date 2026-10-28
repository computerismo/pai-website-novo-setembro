'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

import { auth } from '@/lib/auth';

export async function logLeadHistory(leadId: string, action: string, description: string) {
  try {
    const session = await auth();
    await prisma.leadHistory.create({
      data: {
        leadId,
        action,
        description,
        userId: session?.user?.id,
        createdBy: session?.user?.name || 'System',
      },
    });
    // No revalidatePath here as this is usually called by other actions
  } catch (error) {
    console.error('Error logging lead history:', error);
    // Don't throw, just log error so main action doesn't fail
  }
}

export async function exportLeadsToCSV() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        history: {
            orderBy: { createdAt: 'desc' },
            take: 1
        } // Include latest history if needed, or just basic data
      }
    });

    // Helper to escape CSV fields
    const escape = (text: string | null) => {
      if (!text) return '';
      // If contains quotes, commas, or newlines, wrap in quotes and escape internal quotes
      if (/[",\n]/.test(text)) {
        return `"${text.replace(/"/g, '""')}"`;
      }
      return text;
    };

    const headers = [
      'ID', 'Nome', 'Email', 'Telefone', 'Tratamento', 'Mensagem', 
      'Status', 'Notas', 'Data Criação', 
      'UTM Source', 'UTM Medium', 'UTM Campaign'
    ];

    const rows = leads.map(lead => [
      lead.id,
      escape(lead.name),
      escape(lead.email),
      escape(lead.phone),
      escape(lead.treatment),
      escape(lead.message),
      escape(lead.status),
      escape(lead.notes),
      lead.createdAt.toISOString(),
      escape(lead.utmSource),
      escape(lead.utmMedium),
      escape(lead.utmCampaign),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    return { success: true, csv: csvContent };
  } catch (error) {
    console.error('Error exporting leads:', error);
    return { success: false, message: 'Erro ao gerar CSV' };
  }
}
