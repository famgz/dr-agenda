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

// for use in actions
export async function getSessionUserElseThrow(message = 'Unauthorized') {
  const user = await getSessionUser();
  if (!user) {
    throw new Error(message);
  }
  return user;
}

// for use in pages
export async function getSessionUserElseRedirect(redirectTo = '/auth') {
  const user = await getSessionUser();
  if (!user) {
    redirect(redirectTo);
  }
  return user;
}

// for use in actions
export async function getSessionUserClinicElseThrow(
  message = 'User clinic not found',
) {
  const user = await getSessionUserElseThrow();
  const clinic = user.clinic;
  if (!clinic) {
    throw new Error(message);
  }
  return clinic;
}

// for use in pages
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
