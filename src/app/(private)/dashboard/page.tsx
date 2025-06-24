import { getSessionUserClinicElseRedirect } from '@/actions/session';
import { getSessionUserElseRedirect } from '@/actions/session';
import Image from 'next/image';

export default async function DashboardPage() {
  const user = await getSessionUserElseRedirect();
  const clinic = await getSessionUserClinicElseRedirect();

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
