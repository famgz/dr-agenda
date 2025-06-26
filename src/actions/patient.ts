'use server';

import { getSessionUserClinicElseThrow } from '@/actions/session';
import { db } from '@/db';
import { patientTable, sexEnum } from '@/db/schema';
import { actionClient } from '@/lib/safe-action';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { string, z } from 'zod';

const upsertPatientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, 'Campo obrigatório'),
  email: z.string().trim().min(1, 'Campo obrigatório').email(),
  phoneNumber: z.string().trim().min(1, 'Campo obrigatório'),
  sex: z.enum(sexEnum.enumValues),
});

const deletePatientSchema = z.object({
  id: string().uuid(),
});

export const upsertPatient = actionClient
  .inputSchema(upsertPatientSchema)
  .action(async ({ parsedInput }) => {
    const clinic = await getSessionUserClinicElseThrow();
    const data = { ...parsedInput, clinicId: clinic.clinicId };
    await db
      .insert(patientTable)
      .values(data)
      .onConflictDoUpdate({
        target: [patientTable.id],
        set: parsedInput,
      });
    revalidatePath('/patients');
  });

export const deletePatient = actionClient
  .inputSchema(deletePatientSchema)
  .action(async ({ parsedInput }) => {
    const clinic = await getSessionUserClinicElseThrow();
    const patient = await db.query.patientTable.findFirst({
      where: eq(patientTable.id, parsedInput.id),
    });
    if (!patient) {
      throw new Error('Patient not found');
    }
    if (patient.clinicId !== clinic.clinicId) {
      throw new Error('Patient belongs to another user');
    }
    await db.delete(patientTable).where(eq(patientTable.id, parsedInput.id));
    revalidatePath('/patients');
  });
