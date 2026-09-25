'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { logLeadHistory } from './lead-history';
import { authorizeServerAction } from '@/lib/security/authorization';

const idSchema = z.string().min(1).max(128);
const idListSchema = z.array(idSchema).min(1).max(100);
const leadStatusSchema = z.enum(['new', 'contacted', 'qualified', 'converted']);

export async function assignLead(leadId: string, assignedToId: string | null) {
  const actor = await authorizeServerAction('leads');
  if (!actor) return { success: false, message: 'Não autorizado' };

  const parsedLeadId = idSchema.safeParse(leadId);
  const parsedAssignee = assignedToId === null ? null : idSchema.safeParse(assignedToId);
  if (!parsedLeadId.success || (parsedAssignee && !parsedAssignee.success)) {
    return { success: false, message: 'Dados inválidos' };
  }

  try {
    if (parsedAssignee?.success) {
      const assigneeExists = await prisma.user.findUnique({
        where: { id: parsedAssignee.data },
        select: { id: true },
      });
      if (!assigneeExists) return { success: false, message: 'Dados inválidos' };
    }

    await prisma.lead.update({
      where: { id: parsedLeadId.data },
      data: {
        assignedToId: parsedAssignee?.success ? parsedAssignee.data : null,
        assignedAt: parsedAssignee?.success ? new Date() : null,
      },
    });

    await logLeadHistory(parsedLeadId.data, 'ASSIGNMENT_CHANGED', 'Lead assignment updated');
    revalidatePath('/admin/leads');
    return { success: true, message: 'Lead atribuído com sucesso' };
  } catch {
    console.error('lead_assignment_failed');
    return { success: false, message: 'Erro ao atribuir lead' };
  }
}

export async function getUsers() {
  const actor = await authorizeServerAction('leads');
  if (!actor) return { success: false, users: [] };

  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    });
    return { success: true, users };
  } catch {
    console.error('lead_assignees_fetch_failed');
    return { success: false, users: [] };
  }
}

export async function bulkUpdateLeadStatus(leadIds: string[], status: string) {
  const actor = await authorizeServerAction('leads');
  if (!actor) return { success: false, message: 'Não autorizado' };
  const parsedIds = idListSchema.safeParse(leadIds);
  const parsedStatus = leadStatusSchema.safeParse(status);
  if (!parsedIds.success || !parsedStatus.success) {
    return { success: false, message: 'Dados inválidos' };
  }

  try {
    const existing = await prisma.lead.findMany({
      where: { id: { in: parsedIds.data } },
      select: { id: true, status: true },
    });
    await prisma.lead.updateMany({
      where: { id: { in: existing.map((lead) => lead.id) } },
      data: { status: parsedStatus.data },
    });

    for (const lead of existing) {
      if (lead.status !== parsedStatus.data) {
        await logLeadHistory(lead.id, 'STATUS_CHANGE', 'Lead status updated in bulk');
      }
    }

    revalidatePath('/admin/leads');
    return { success: true, message: `${existing.length} leads atualizados` };
  } catch {
    console.error('lead_bulk_status_update_failed');
    return { success: false, message: 'Erro ao atualizar leads' };
  }
}

export async function bulkDeleteLeads(leadIds: string[]) {
  const actor = await authorizeServerAction('leads');
  if (!actor) return { success: false, message: 'Não autorizado' };
  const parsedIds = idListSchema.safeParse(leadIds);
  if (!parsedIds.success) return { success: false, message: 'Dados inválidos' };

  try {
    const result = await prisma.lead.deleteMany({
      where: { id: { in: parsedIds.data } },
    });
    revalidatePath('/admin/leads');
    return { success: true, message: `${result.count} leads excluídos` };
  } catch {
    console.error('lead_bulk_delete_failed');
    return { success: false, message: 'Erro ao excluir leads' };
  }
}
