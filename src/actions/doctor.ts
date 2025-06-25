'use server';

import {
  getSessionUserClinicElseThrow,
  getSessionUserElseThrow,
} from '@/actions/session';
import { db } from '@/db';
import { doctorTable } from '@/db/schema';
import { actionClient } from '@/lib/safe-action';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { string, z } from 'zod';

const upsertDoctorSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().trim().min(1, 'Campo obrigatório'),
    specialty: z.string().trim().min(1, 'Campo obrigatório'),
    appointmentPriceInCents: z.number().min(1, 'Campo obrigatório'),
    availableFromWeekDay: z
      .number()
      .min(0, 'Campo inválido')
      .max(6, 'Campo inválido'),
    availableToWeekDay: z
      .number()
      .min(0, 'Campo inválido')
      .max(6, 'Campo inválido'),
    availableFromTime: z.string().trim().min(1, 'Campo obrigatório'),
    availableToTime: z.string().trim().min(1, 'Campo obrigatório'),
  })
  .superRefine((data, ctx) => {
    if (data.availableFromTime > data.availableToTime) {
      const message = 'Horário inicial deve ser anterior ao final';
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ['availableFromTime'],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ['availableToTime'],
      });
    }
  });

const deleteDoctorSchema = z.object({
  id: string().uuid(),
});

export const upsertDoctor = actionClient
  .inputSchema(upsertDoctorSchema)
  .action(async ({ parsedInput }) => {
    const clinic = await getSessionUserClinicElseThrow();
    const data = { ...parsedInput, clinicId: clinic.clinicId };
    await db
      .insert(doctorTable)
      .values(data)
      .onConflictDoUpdate({
        target: [doctorTable.id],
        set: parsedInput,
      });
    revalidatePath('/doctors');
  });

export const deleteDoctor = actionClient
  .inputSchema(deleteDoctorSchema)
  .action(async ({ parsedInput }) => {
    const clinic = await getSessionUserClinicElseThrow();
    const doctor = await db.query.doctorTable.findFirst({
      where: eq(doctorTable.id, parsedInput.id),
    });
    if (!doctor) {
      throw new Error('Doctor not found');
    }
    if (doctor.clinicId !== clinic.clinicId) {
      throw new Error('Doctor belongs to another user');
    }
    await db.delete(doctorTable).where(eq(doctorTable.id, parsedInput.id));
    revalidatePath('/doctors');
  });
