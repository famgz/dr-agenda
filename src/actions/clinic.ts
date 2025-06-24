'use server';

import {
  getSessionUserElseRedirect,
  getSessionUserElseThrow,
} from '@/actions/user';
import { db } from '@/db';
import { clinicTable, usersToClinicsTable } from '@/db/schema';
import { redirect } from 'next/navigation';

export async function createClinic(name: string) {
  const user = await getSessionUserElseThrow();
  const [clinic] = await db.insert(clinicTable).values({ name }).returning();
  await db
    .insert(usersToClinicsTable)
    .values({ clinicId: clinic.id, userId: user!.id });
}

export async function getSessionUserClinicElseThrow(
  message = 'Clinic not found',
) {
  const user = await getSessionUserElseThrow();
  const clinic = user.clinic;
  if (!clinic) {
    throw new Error(message);
  }
  return clinic;
}

export async function getSessionUserClinicElseRedirect(
  redirectTo = '/clinic-form',
) {
  const user = await getSessionUserElseRedirect();
  const clinic = user.clinic;
  if (!clinic) {
    redirect(redirectTo);
  }
  return clinic;
}
