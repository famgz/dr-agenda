'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function getSessionUserElseThrow() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  if (!session?.user) {
    throw new Error('Unauthenticated');
  }
  return user;
}
