'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { logLeadHistory } from './lead-history';

export async function assignLead(leadId: string, assignedToId: string | null) {
  try {
    const session = await auth();
    
    // Get previous assignment for logging
    const previousLead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { assignedTo: { select: { name: true } } },
    });

    // Get new assignee name if assigning
    let newAssigneeName = 'Ninguém';
    if (assignedToId) {
      const newAssignee = await prisma.user.findUnique({
        where: { id: assignedToId },
        select: { name: true },
      });
      newAssigneeName = newAssignee?.name || 'Desconhecido';
    }

    // Update the lead
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        assignedToId: assignedToId || null,
        assignedAt: assignedToId ? new Date() : null,
      },
    });

    // Log the change
    const previousName = previousLead?.assignedTo?.name || 'Ninguém';
    if (previousName !== newAssigneeName) {
      await logLeadHistory(
        leadId,
        'ATRIBUIÇÃO',
        `Lead atribuído de "${previousName}" para "${newAssigneeName}"`
      );
    }

    revalidatePath('/admin/leads');
    return { success: true, message: 'Lead atribuído com sucesso' };
  } catch (error) {
    console.error('Error assigning lead:', error);
    return { success: false, message: 'Erro ao atribuir lead' };
  }
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: { name: 'asc' },
    });
    return { success: true, users };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { success: false, users: [] };
  }
}

// Bulk actions
export async function bulkUpdateLeadStatus(leadIds: string[], status: string) {
  try {
    const session = await auth();
    
    await prisma.lead.updateMany({
      where: { id: { in: leadIds } },
      data: { status },
    });

    // Log history for each lead
    const statusMap: Record<string, string> = {
      new: 'Novo',
      contacted: 'Contactado',
      qualified: 'Qualificado',
      converted: 'Convertido',
    };

    for (const leadId of leadIds) {
      await logLeadHistory(
        leadId,
        'ALTERAÇÃO_DE_STATUS_EM_LOTE',
        `Status alterado para "${statusMap[status] || status}" (ação em lote)`
      );
    }

    revalidatePath('/admin/leads');
    return { success: true, message: `${leadIds.length} leads atualizados` };
  } catch (error) {
    console.error('Error bulk updating leads:', error);
    return { success: false, message: 'Erro ao atualizar leads' };
  }
}

export async function bulkDeleteLeads(leadIds: string[]) {
  try {
    await prisma.lead.deleteMany({
      where: { id: { in: leadIds } },
    });

    revalidatePath('/admin/leads');
    return { success: true, message: `${leadIds.length} leads excluídos` };
  } catch (error) {
    console.error('Error bulk deleting leads:', error);
    return { success: false, message: 'Erro ao excluir leads' };
  }
}
