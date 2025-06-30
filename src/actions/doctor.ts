'use server';

import { getSessionUserClinicElseThrow } from '@/actions/session';
import { db } from '@/db';
import { doctorTable } from '@/db/schema';
import { authActionClient, ClinicOwnershipError } from '@/lib/safe-action';
import { desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { string, z } from 'zod';

export const getDoctors = authActionClient
  .metadata({ actionName: 'getDoctors' })
  .action(async () => {
    const clinic = await getSessionUserClinicElseThrow();
    return await db.query.doctorTable.findMany({
      where: eq(doctorTable.clinicId, clinic.clinicId),
      orderBy: [desc(doctorTable.createdAt)],
    });
  });

const doctorByIdSchema = z.object({
  id: z.string().uuid(),
});

export const getDoctorById = authActionClient
  .metadata({ actionName: 'getDoctorById' })
  .inputSchema(doctorByIdSchema)
  .action(async ({ parsedInput }) => {
    return await db.query.doctorTable.findFirst({
      where: eq(doctorTable.id, parsedInput.id),
    });
  });

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
    availableFromTime: z
      .string()
      .min(1, 'Campo obrigatório')
      .regex(/^([01]?\d|2[0-3]):[0-5]\d:[0-5]\d$/, 'Formato inválido'),
    availableToTime: z
      .string()
      .min(1, 'Campo obrigatório')
      .regex(/^([01]?\d|2[0-3]):[0-5]\d:[0-5]\d$/, 'Formato inválido'),
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

export const upsertDoctor = authActionClient
  .metadata({ actionName: 'upsertDoctor' })
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

export const deleteDoctor = authActionClient
  .metadata({ actionName: 'deleteDoctor' })
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
      throw new Error('Unauthorized');
    }
    await db.delete(doctorTable).where(eq(doctorTable.id, parsedInput.id));
    revalidatePath('/doctors');
  });
