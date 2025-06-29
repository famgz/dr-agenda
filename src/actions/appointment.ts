'use server';

import { getDoctorById } from '@/actions/doctor';
import { getSessionUserClinicElseThrow } from '@/actions/session';
import { db } from '@/db';
import { appointmentTable } from '@/db/schema';
import { authActionClient, ClinicOwnershipError } from '@/lib/safe-action';
import { desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export const getAppointments = authActionClient
  .metadata({ actionName: 'getAppointments' })
  .action(async () => {
    const clinic = await getSessionUserClinicElseThrow();
    return await db.query.appointmentTable.findMany({
      where: eq(appointmentTable.clinicId, clinic.clinicId),
      with: { doctor: true, patient: true },
      orderBy: [desc(appointmentTable.date)],
    });
  });

const upsertAppointmentSchema = z.object({
  id: z.string().uuid().optional(),
  date: z.date(),
  appointmentPriceInCents: z.number(),
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
});

export const upsertAppointment = authActionClient
  .metadata({ actionName: 'upsertAppointment' })
  .inputSchema(upsertAppointmentSchema)
  .action(async ({ parsedInput }) => {
    const clinic = await getSessionUserClinicElseThrow();
    const { data: doctor } = await getDoctorById({ id: parsedInput.doctorId });
    if (!doctor) {
      throw new Error('Médico não encontrado');
    }
    if (doctor?.clinicId !== clinic.clinicId) {
      throw new ClinicOwnershipError();
    }
    const data = { ...parsedInput, clinicId: clinic.clinicId };
    await db
      .insert(appointmentTable)
      .values(data)
      .onConflictDoUpdate({
        target: [appointmentTable.id],
        set: parsedInput,
      });
    revalidatePath('/appointments');
  });
