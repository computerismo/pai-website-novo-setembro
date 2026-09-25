'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { logLeadHistory } from './lead-history';
import { authorizeServerAction } from '@/lib/security/authorization';

const leadIdSchema = z.string().min(1).max(128);
const updateStatusSchema = z.object({
  id: leadIdSchema,
  status: z.enum(['new', 'contacted', 'qualified', 'converted']),
});

export async function updateLeadStatus(formData: FormData) {
  const actor = await authorizeServerAction('leads');
  if (!actor) return { success: false, message: 'Não autorizado' };

  const parsed = updateStatusSchema.safeParse({
    id: formData.get('id'),
    status: formData.get('status'),
  });
  if (!parsed.success) return { success: false, message: 'Dados inválidos' };

  try {
    const previousLead = await prisma.lead.findUnique({
      where: { id: parsed.data.id },
      select: { status: true },
    });

    await prisma.lead.update({
      where: { id: parsed.data.id },
      data: { status: parsed.data.status },
    });

    if (previousLead && previousLead.status !== parsed.data.status) {
      await logLeadHistory(parsed.data.id, 'STATUS_CHANGE', 'Lead status updated');
    }

    revalidatePath('/admin/leads');
    return { success: true, message: 'Status atualizado com sucesso' };
  } catch {
    console.error('lead_status_update_failed');
    return { success: false, message: 'Erro ao atualizar status' };
  }
}

const addNoteSchema = z.object({
  id: leadIdSchema,
  note: z.string().trim().min(1).max(2000),
});

export async function addLeadNote(formData: FormData) {
  const actor = await authorizeServerAction('leads');
  if (!actor) return { success: false, message: 'Não autorizado' };

  const parsed = addNoteSchema.safeParse({
    id: formData.get('id'),
    note: formData.get('note'),
  });
  if (!parsed.success) return { success: false, message: 'Dados inválidos' };

  try {
    await prisma.leadNote.create({
      data: {
        leadId: parsed.data.id,
        content: parsed.data.note,
        createdBy: actor.name || 'Admin',
        userId: actor.id,
      },
    });

    await logLeadHistory(parsed.data.id, 'NOTE_ADDED', 'Lead note added');
    revalidatePath('/admin/leads');
    return { success: true, message: 'Nota adicionada com sucesso' };
  } catch {
    console.error('lead_note_create_failed');
    return { success: false, message: 'Erro ao adicionar nota' };
  }
}

export async function deleteLead(id: string) {
  const actor = await authorizeServerAction('leads');
  if (!actor) return { success: false, message: 'Não autorizado' };
  const parsedId = leadIdSchema.safeParse(id);
  if (!parsedId.success) return { success: false, message: 'Dados inválidos' };

  try {
    await prisma.lead.delete({ where: { id: parsedId.data } });
    revalidatePath('/admin/leads');
    return { success: true, message: 'Lead excluído com sucesso' };
  } catch {
    console.error('lead_delete_failed');
    return { success: false, message: 'Erro ao excluir lead' };
  }
}
