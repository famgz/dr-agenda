'use server';

import { getSessionUserClinicElseThrow } from '@/actions/session';
import { db } from '@/db';
import { patientTable, sexEnum } from '@/db/schema';
import { authActionClient, ClinicOwnershipError } from '@/lib/safe-action';
import { asc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { string, z } from 'zod';

export const getPatients = authActionClient
  .metadata({ actionName: 'getPatients' })
  .action(async () => {
    const clinic = await getSessionUserClinicElseThrow();
    return await db.query.patientTable.findMany({
      where: eq(patientTable.clinicId, clinic.clinicId),
      orderBy: [asc(patientTable.name)],
    });
  });

const upsertPatientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, 'Campo obrigatório'),
  email: z.string().trim().min(1, 'Campo obrigatório').email(),
  phoneNumber: z.string().trim().min(1, 'Campo obrigatório'),
  sex: z.enum(sexEnum.enumValues),
});

export const upsertPatient = authActionClient
  .metadata({ actionName: 'upsertPatient' })
  .inputSchema(upsertPatientSchema)
  .action(
    async ({ parsedInput }) => {
      const clinic = await getSessionUserClinicElseThrow();
      const data = { ...parsedInput, clinicId: clinic.clinicId };
      await db
        .insert(patientTable)
        .values(data)
        .onConflictDoUpdate({
          target: [patientTable.id],
          set: parsedInput,
        });
    },
    {
      onSuccess: async () => {
        revalidatePath('/patients');
      },
    },
  );

const deletePatientSchema = z.object({
  id: string().uuid(),
});

export const deletePatient = authActionClient
  .metadata({ actionName: 'deletePatient' })
  .inputSchema(deletePatientSchema)
  .action(
    async ({ parsedInput }) => {
      const clinic = await getSessionUserClinicElseThrow();
      const patient = await db.query.patientTable.findFirst({
        where: eq(patientTable.id, parsedInput.id),
      });
      if (!patient) {
        throw new Error('Paciente não encontrado');
      }
      if (patient.clinicId !== clinic.clinicId) {
        throw new ClinicOwnershipError();
      }
      await db.delete(patientTable).where(eq(patientTable.id, parsedInput.id));
    },
    {
      onSuccess: async () => {
        revalidatePath('/patients');
      },
    },
  );
