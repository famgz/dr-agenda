'use server';

import { getSessionUserElseThrow } from '@/actions/user';
import { db } from '@/db';
import { doctorTable } from '@/db/schema';
import { actionClient } from '@/lib/safe-action';
import { z } from 'zod';

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

export const upsertDoctor = actionClient
  .inputSchema(upsertDoctorSchema)
  .action(async ({ parsedInput }) => {
    const user = await getSessionUserElseThrow();
    const clinic = user.clinic;
    const data = { ...parsedInput, clinicId: clinic.clinicId };
    await db
      .insert(doctorTable)
      .values(data)
      .onConflictDoUpdate({
        target: [doctorTable.id],
        set: parsedInput,
      });
  });
