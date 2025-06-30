'use client';

import { upsertAppointment } from '@/actions/appointment';
import LoaderIcon from '@/components/loader';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Appointment, Doctor, Patient } from '@/types/drizzle';
import { getFirstErrorMessage } from '@/utils/error';
import {
  generateTimeArray,
  getAppointmentTimeStringFromDate,
} from '@/utils/time';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  date: z
    .date()
    .nullable()
    .refine((val) => val !== null, { message: 'Campo obrigatório' }),
  time: z
    .string()
    .min(1, 'Campo obrigatório')
    .regex(/^([01]?\d|2[0-3]):[0-5]\d:[0-5]\d$/, 'Formato inválido'),
  appointmentPriceInCents: z
    .number()
    .min(1, 'Campo obrigatório')
    .transform((value) => value * 100),
  doctorId: z.string().min(1, 'Campo obrigatório').uuid(),
  patientId: z.string().min(1, 'Campo obrigatório').uuid(),
});

type FormSchema = Omit<z.infer<typeof formSchema>, 'date'> & {
  date: Date | null;
};

interface Props {
  children: ReactNode;
  appointment?: Appointment;
  doctors?: Doctor[];
  patients?: Patient[];
}

export default function UpsertAppointmentFormDialog({
  children,
  appointment,
  doctors,
  patients,
}: Props) {
  const [open, setOpen] = useState(false);
  const [modalJustOpened, setModalJustOpened] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(),
  });

  function getDefaultValues() {
    return {
      date: appointment?.date ?? null,
      appointmentPriceInCents: appointment?.appointmentPriceInCents
        ? appointment.appointmentPriceInCents / 100
        : 0,
      time: appointment?.date
        ? getAppointmentTimeStringFromDate(appointment.date)
        : '',
      doctorId: appointment?.doctorId ?? '',
      patientId: appointment?.patientId ?? '',
    };
  }

  const watchedDoctorId = form.watch('doctorId');

  const doctorScheduleTimes = useMemo(() => {
    const doctor = doctors?.find((doctor) => doctor.id === watchedDoctorId);
    if (!doctor) {
      return [];
    }
    const times = generateTimeArray(
      Number(doctor.availableFromTime.split(':')[0]),
      Number(doctor.availableToTime.split(':')[0]),
      30,
    );
    // persist original appointment time if switch back to the initial doctor
    if (appointment && watchedDoctorId === appointment.doctorId) {
      const savedTime = getAppointmentTimeStringFromDate(appointment.date);
      const isTimeIncluded = times.some((time) => time.value === savedTime);
      if (savedTime && !isTimeIncluded) {
        times.push({ value: savedTime, label: savedTime.slice(0, 5) });
      }
    }
    return times;
  }, [watchedDoctorId]);

  const submitAction = useAction(upsertAppointment, {
    onSuccess: () => {
      setOpen(false);
      toast.success('Lista de agendamentos atualizada com sucesso');
    },
    onError: (error) => {
      console.error(error);
      toast.error(
        'Erro ao atualizar lista de agendamentos ' +
          getFirstErrorMessage(error),
      );
    },
  });

  const isSubmitting = useMemo(
    () => form.formState.isSubmitting || submitAction.isPending,
    [form.formState, submitAction.isPending],
  );

  async function onSubmit(values: FormSchema) {
    submitAction.execute({
      ...values,
      id: appointment?.id,
      date: values.date!,
    });
    submitAction.reset();
  }

  useEffect(() => {
    if (modalJustOpened) {
      setModalJustOpened(false);
      return;
    }
    form.setValue('time', '');
    form.setValue('date', null);
    const doctor = watchedDoctorId
      ? doctors?.find((d) => d.id === watchedDoctorId)
      : null;
    form.setValue(
      'appointmentPriceInCents',
      doctor?.appointmentPriceInCents
        ? doctor.appointmentPriceInCents / 100
        : 0,
    );
  }, [watchedDoctorId, doctors, modalJustOpened]);

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues());
    }
  }, [open, appointment]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {appointment ? 'Editar agendamento' : 'Adicionar agendamento'}
          </DialogTitle>
          <DialogDescription>
            {appointment
              ? 'Atualizar informações do agendamento'
              : 'Agenda uma nova consulta'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="doctorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Médico</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione um médico" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {doctors?.map((doctor) => (
                          <SelectItem value={doctor.id} key={doctor.id}>
                            {doctor.name}{' '}
                            <span className="text-muted-foreground">
                              ({doctor.specialty})
                            </span>
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
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paciente</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione um paciente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {patients?.map((patient) => (
                          <SelectItem value={patient.id} key={patient.id}>
                            {patient.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data da consulta</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            disabled={!watchedDoctorId}
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP', { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || !watchedDoctorId
                          }
                          captionLayout="dropdown"
                          formatters={{
                            formatMonthDropdown: (date) =>
                              date.toLocaleString('pt-BR', { month: 'long' }),
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário da consulta</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!watchedDoctorId}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o horário" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {doctorScheduleTimes?.map((time) => (
                            <SelectItem value={time.value} key={time.value}>
                              {time.label}
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
                name="appointmentPriceInCents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço da Consulta</FormLabel>
                    <FormControl>
                      <NumericFormat
                        placeholder="Digite o preço"
                        value={field.value || ''}
                        onValueChange={(value) => {
                          field.onChange(value.floatValue);
                        }}
                        decimalScale={2}
                        disabled={!watchedDoctorId}
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
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant={'outline'}
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <span>Salvar agendamento</span>
                {isSubmitting && <LoaderIcon />}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
