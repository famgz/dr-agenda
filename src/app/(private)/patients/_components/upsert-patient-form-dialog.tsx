'use client';

import { upsertPatient } from '@/actions/patient';
import DeletePatientDialog from '@/app/(private)/patients/_components/delete-patient-dialog';
import LoaderIcon from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { sexEnum } from '@/db/schema';
import { Patient } from '@/types/drizzle';
import { generateTimeArray } from '@/utils/time';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2Icon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().trim().min(1, 'Campo obrigatório'),
  email: z.string().trim().min(1, 'Campo obrigatório').email(),
  phoneNumber: z
    .string()
    .trim()
    .min(1, 'Campo obrigatório')
    .transform((value) => value.replace(/\D/g, ''))
    .refine(
      (value) => value.length === 10 || value.length === 11,
      'Telefone inválido',
    ),
  sex: z.enum(sexEnum.enumValues),
});

interface Props {
  children: ReactNode;
  patient?: Patient;
}

export default function UpsertPatientFormDialog({ children, patient }: Props) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(),
  });

  function getDefaultValues() {
    return {
      name: patient?.name ?? '',
      email: patient?.email ?? '',
      phoneNumber: patient?.phoneNumber ?? '',
      sex: patient?.sex,
    };
  }

  const submitAction = useAction(upsertPatient, {
    onSuccess: () => {
      setOpen(false);
      toast.success('Lista de pacientes atualizada com sucesso');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Erro ao atualizar lista de pacientes');
    },
  });

  const isSubmitting = useMemo(
    () => form.formState.isSubmitting || submitAction.isPending,
    [form.formState, submitAction.isPending],
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    submitAction.execute({ ...values, id: patient?.id });
    submitAction.reset();
  }

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues());
    }
  }, [open, patient]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {patient ? patient.name : 'Adicionar paciente'}
          </DialogTitle>
          <DialogDescription>
            {patient
              ? 'Atualizar informações do paciente'
              : 'Adicione um novo paciente para fazer parte de sua clínica'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <PatternFormat
                      format="(##) #####-####"
                      mask="_"
                      placeholder="(99) 99999-9999"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value.value);
                      }}
                      customInput={Input}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sexo</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o dia inicial" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          { value: 'male', label: 'Masculino' },
                          { value: 'female', label: 'Feminino' },
                        ].map(({ value, label }) => (
                          <SelectItem value={value} key={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant={'outline'}
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              {!!patient && (
                <DeletePatientDialog patient={patient}>
                  <Button variant={'outline'}>
                    <Trash2Icon />
                  </Button>
                </DeletePatientDialog>
              )}
              <Button type="submit" disabled={isSubmitting}>
                <span>Salvar paciente</span>
                {isSubmitting && <LoaderIcon />}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
