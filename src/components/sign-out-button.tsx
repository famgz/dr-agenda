'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleSignOut() {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: { onSuccess: () => router.push('/auth') },
      });
    });
  }

  return (
    <Button onClick={handleSignOut} disabled={isPending}>
      Sair
    </Button>
  );
}
