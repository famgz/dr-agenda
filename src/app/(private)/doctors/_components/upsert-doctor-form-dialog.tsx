'use client';

import { upsertDoctor } from '@/actions/doctor';
import DeleteDoctorButton from '@/app/(private)/doctors/_components/delete-doctor-button';
import LoaderIcon from '@/components/loader';
import SpecialtyCardsSelect from '@/components/specialty-cards-select';
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { weekDays } from '@/constants/weekdays';
import { Doctor } from '@/types/drizzle';
import { getFirstErrorMessage } from '@/utils/error';
import { generateTimeArray } from '@/utils/time';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { toast } from 'sonner';
import { z } from 'zod';

const ScheduleTimes = {
  Manhã: generateTimeArray(5, 13, 30),
  Tarde: generateTimeArray(13, 19, 30),
  Noite: generateTimeArray(19, 24, 30),
};

const formSchema = z
  .object({
    name: z.string().trim().min(1, 'Campo obrigatório'),
    specialty: z.string().trim().min(1, 'Campo obrigatório'),
    appointmentPriceInCents: z
      .number()
      .min(1, 'Campo obrigatório')
      .transform((value) => value * 100),
    availableFromWeekDay: z
      .number()
      .min(0, 'Campo inválido')
      .max(6, 'Campo inválido'),
    availableToWeekDay: z
      .number()
      .min(0, 'Campo inválido')
      .max(6, 'Campo inválido'),
    availableFromTime: z
      .string()
      .min(1, 'Campo obrigatório')
      .regex(/^([01]?\d|2[0-3]):[0-5]\d:[0-5]\d$/, 'Formato inválido'),
    availableToTime: z
      .string()
      .min(1, 'Campo obrigatório')
      .regex(/^([01]?\d|2[0-3]):[0-5]\d:[0-5]\d$/, 'Formato inválido'),
  })
  .superRefine((data, ctx) => {
    if (data.availableFromTime > data.availableToTime) {
      const message = 'Horário inicial deve ser anterior ao final';
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ['availableFromTime'],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ['availableToTime'],
      });
    }
  });

interface Props {
  children: ReactNode;
  doctor?: Doctor;
}

export default function UpsertDoctorFormDialog({ children, doctor }: Props) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(),
  });

  function getDefaultValues() {
    return {
      name: doctor?.name ?? '',
      specialty: doctor?.specialty ?? '',
      appointmentPriceInCents: doctor?.appointmentPriceInCents
        ? doctor.appointmentPriceInCents / 100
        : 0,
      availableFromWeekDay: doctor?.availableFromWeekDay ?? -1,
      availableToWeekDay: doctor?.availableToWeekDay ?? -1,
      availableFromTime: doctor?.availableFromTime ?? '',
      availableToTime: doctor?.availableToTime ?? '',
    };
  }

  const submitAction = useAction(upsertDoctor, {
    onSuccess: () => {
      setOpen(false);
      toast.success('Lista de médicos atualizada com sucesso');
    },
    onError: (error) => {
      console.error(error);
      toast.error(
        'Erro ao atualizar lista de médicos' + getFirstErrorMessage(error),
      );
    },
  });

  const isSubmitting = useMemo(
    () => form.formState.isSubmitting || submitAction.isPending,
    [form.formState, submitAction.isPending],
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    submitAction.execute({ ...values, id: doctor?.id });
    submitAction.reset(); // it appears to avoid the toast.success double render
  }

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues());
    }
  }, [open, doctor]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{doctor ? doctor.name : 'Adicionar médico'}</DialogTitle>
          <DialogDescription>
            {doctor
              ? 'Atualizar informações do médico'
              : 'Adicione um novo médico para fazer parte de sua clínica'}
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
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especialidade</FormLabel>
                    <FormControl>
                      <SpecialtyCardsSelect
                        initialValue={field.value}
                        onSelect={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="appointmentPriceInCents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço da Consulta</FormLabel>
                    <FormControl>
                      <NumericFormat
                        placeholder="Digite preço da consulta"
                        value={field.value || ''}
                        onValueChange={(value) => {
                          field.onChange(value.floatValue);
                        }}
                        decimalScale={2}
                        fixedDecimalScale
                        decimalSeparator=","
                        allowNegative={false}
                        allowLeadingZeros={false}
                        thousandSeparator="."
                        customInput={Input}
                        prefix="R$"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="availableFromWeekDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia inicial de disponibilidade</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={
                          field.value >= 0 ? field.value.toString() : ''
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o dia inicial" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {weekDays.map((weekDay) => (
                            <SelectItem
                              value={weekDay.value}
                              key={weekDay.value}
                            >
                              {weekDay.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableToWeekDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia final de disponibilidade</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={
                          field.value >= 0 ? field.value.toString() : ''
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o dia final" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {weekDays.map((weekDay) => (
                            <SelectItem
                              value={weekDay.value}
                              key={weekDay.value}
                            >
                              {weekDay.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="availableFromTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário inicial de disponibilidade</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o horário inicial" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(ScheduleTimes).map(
                            ([shift, times]) => (
                              <SelectGroup key={shift}>
                                <SelectLabel>{shift}</SelectLabel>
                                {times.map((time) => (
                                  <SelectItem
                                    value={time.value}
                                    key={time.value}
                                  >
                                    {time.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableToTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário final de disponibilidade</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o horário final" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(ScheduleTimes).map(
                            ([shift, times]) => (
                              <SelectGroup key={shift}>
                                <SelectLabel>{shift}</SelectLabel>
                                {times.map((time) => (
                                  <SelectItem
                                    value={time.value}
                                    key={time.value}
                                  >
                                    {time.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant={'outline'}
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              {!!doctor && <DeleteDoctorButton doctor={doctor} />}
              <Button type="submit" disabled={isSubmitting}>
                <span>Salvar médico</span>
                {isSubmitting && <LoaderIcon />}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
