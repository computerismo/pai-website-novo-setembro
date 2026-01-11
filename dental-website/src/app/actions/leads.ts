'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { logLeadHistory } from './lead-history';
import { auth } from '@/lib/auth';

const updateStatusSchema = z.object({
  id: z.string(),
  status: z.enum(['new', 'contacted', 'qualified', 'converted']),
});

const updateNotesSchema = z.object({
  id: z.string(),
  notes: z.string(),
});

export async function updateLeadStatus(formData: FormData) {
  const id = formData.get('id') as string;
  const status = formData.get('status') as string;

  try {
    const validated = updateStatusSchema.parse({ id, status });

    // Get previous status for logging
    const previousLead = await prisma.lead.findUnique({
      where: { id: validated.id },
      select: { status: true }
    });

    await prisma.lead.update({
      where: { id: validated.id },
      data: { status: validated.status },
    });

    if (previousLead && previousLead.status !== validated.status) {
      const statusMap: Record<string, string> = {
        new: 'Novo',
        contacted: 'Contactado',
        qualified: 'Qualificados',
        converted: 'Convertido'
      };
      
      const oldStatus = statusMap[previousLead.status] || previousLead.status;
      const newStatus = statusMap[validated.status] || validated.status;

      await logLeadHistory(
        validated.id, 
        'ALTERAÇÃO_DE_STATUS', 
        `Status alterado de "${oldStatus}" para "${newStatus}"`
      );
    }

    revalidatePath('/admin/leads');
    return { success: true, message: 'Status atualizado com sucesso' };
  } catch (error) {
    console.error('Error updating lead status:', error);
    return { success: false, message: 'Erro ao atualizar status' };
  }
}

// Deprecated: Use addLeadNote instead (for migration support)
export async function updateLeadNotes(formData: FormData) {
  return addLeadNote(formData);
}

const addNoteSchema = z.object({
  id: z.string(),
  note: z.string().min(1, 'A nota não pode estar vazia'),
});

export async function addLeadNote(formData: FormData) {
  const id = formData.get('id') as string;
  const note = formData.get('note') as string;

  try {
    const session = await auth();
    const validated = addNoteSchema.parse({ id, note });

    await prisma.leadNote.create({
      data: {
        leadId: validated.id,
        content: validated.note,
        createdBy: session?.user?.name || 'System',
        userId: session?.user?.id,
      },
    });

    await logLeadHistory(
      validated.id, 
      'NOTA_ADICIONADA', 
      'Nova anotação adicionada'
    );

    revalidatePath('/admin/leads');
    return { success: true, message: 'Nota adicionada com sucesso' };
  } catch (error) {
    console.error('Error adding lead note:', error);
    return { success: false, message: 'Erro ao adicionar nota' };
  }
}

export async function deleteLead(id: string) {
  try {
    await prisma.lead.delete({
      where: { id },
    });
    
    revalidatePath('/admin/leads');
    return { success: true, message: 'Lead excluído com sucesso' };
  } catch (error) {
    console.error('Error deleting lead:', error);
    return { success: false, message: 'Erro ao excluir lead' };
  }
}
