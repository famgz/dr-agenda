import { getSessionUser } from '@/actions/session';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getSessionUser();
  if (user) {
    redirect('/dashboard');
  } else redirect('/auth');
}
