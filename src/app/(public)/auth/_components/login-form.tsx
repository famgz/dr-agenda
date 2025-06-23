'use client';

import LoaderIcon from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import googleIcon from '@/assets/icons/google.svg';
import { auth } from '@/lib/auth';

const formSchema = z.object({
  email: z.string().trim().min(1, 'Campo obrigatório').email('Email inválido'),
  password: z.string().trim().min(8, 'Mínimo de 8 caracteres'),
});

export default function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function handleCredentialsLogin(values: z.infer<typeof formSchema>) {
    const { email, password } = values;
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          toast.success('Login realizado com sucesso!');
          router.push('/dashboard');
        },
        onError: (ctx) => {
          console.log(ctx.error.message);
          toast.error('Email ou senha inválido');
        },
      },
    );
  }

  async function handleGoogleLogin() {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/dashboard',
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Faça login para continuar</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCredentialsLogin)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite senha"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <LoaderIcon /> : 'Entrar'}
            </Button>
            <Button
              type="button"
              className="w-full"
              variant={'outline'}
              onClick={handleGoogleLogin}
            >
              <Image
                src={googleIcon}
                alt="Google Logo"
                height={16}
                width={16}
              />
              Entrar com Google
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
