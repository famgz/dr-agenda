import { getSessionUserElseRedirect } from '@/actions/user';
import SignOutButton from '@/components/sign-out-button';
import { db } from '@/db';
import { usersToClinicsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await getSessionUserElseRedirect();

  const clinics = await db.query.usersToClinicsTable.findMany({
    where: eq(usersToClinicsTable.userId, user.id),
  });

  if (clinics.length === 0) {
    redirect('/clinic-form');
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{user.name}</p>
      <p>{user.email}</p>
      <Image
        src={user.image ?? ''}
        alt="Imagem do usuario"
        height={48}
        width={48}
      />
      <SignOutButton />
    </div>
  );
}
