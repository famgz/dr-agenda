'use server';

import { getSessionUserElseThrow } from '@/actions/user';
import { db } from '@/db';
import { clinicTable, usersToClinicsTable } from '@/db/schema';

export async function createClinic(name: string) {
  const user = await getSessionUserElseThrow();
  const [clinic] = await db.insert(clinicTable).values({ name }).returning();
  await db
    .insert(usersToClinicsTable)
    .values({ clinicId: clinic.id, userId: user!.id });
}
