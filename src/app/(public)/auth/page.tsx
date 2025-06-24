import { getSessionUser } from '@/actions/session';
import LoginForm from '@/app/(public)/auth/_components/login-form';
import RegisterForm from '@/app/(public)/auth/_components/register-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { redirect } from 'next/navigation';

export default async function AuthPage() {
  const user = await getSessionUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="flex-center h-screen w-screen">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Criar Conta</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
