import { getSessionUserElseRedirect } from '@/actions/user';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await getSessionUserElseRedirect();
  const clinic = user.clinic;

  if (!clinic) {
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
    </div>
  );
}
