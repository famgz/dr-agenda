'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getSessionUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user;
}

export async function getSessionUserElseThrow() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error('Unauthenticated');
  }
  return user;
}

export async function getSessionUserElseRedirect() {
  const user = await getSessionUser();
  if (!user) {
    redirect('/auth');
  }
  return user;
}
