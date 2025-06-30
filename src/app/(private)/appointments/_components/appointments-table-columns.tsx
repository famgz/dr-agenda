'use client';

import UpsertAppointmentFormDialog from '@/app/(private)/appointments/_components/upsert-appointment-form-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AppointmentWithRelations } from '@/types/drizzle';
import { toReal } from '@/utils/money';
import { ColumnDef } from '@tanstack/react-table';
import { EditIcon, EllipsisVerticalIcon } from 'lucide-react';

import { Doctor, Patient } from '@/types/drizzle';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AppointmentStatusBadge from '@/components/appointment-status-badge';

interface Props {
  doctors: Doctor[];
  patients: Patient[];
}

export function appointmentsTableColumns({
  doctors,
  patients,
}: Props): ColumnDef<AppointmentWithRelations>[] {
  return [
    {
      id: 'date',
      accessorKey: 'date',
      header: 'Data',
      cell: ({
        row: {
          original: { date },
        },
      }) => format(date, '	Pp', { locale: ptBR }),
    },
    {
      id: 'doctor',
      accessorKey: 'doctor',
      header: 'Médico',
      cell: ({
        row: {
          original: { doctor },
        },
      }) => doctor.name,
    },
    {
      id: 'patient',
      accessorKey: 'patient',
      header: 'Paciente',
      cell: ({
        row: {
          original: { patient },
        },
      }) => patient.name,
    },
    {
      id: 'appointmentPriceInCents',
      accessorKey: 'appointmentPriceInCents',
      header: 'Preço consulta',
      cell: ({
        row: {
          original: { appointmentPriceInCents },
        },
      }) => toReal(appointmentPriceInCents),
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      cell: ({
        row: {
          original: { status },
        },
      }) => <AppointmentStatusBadge status={status} />,
    },
    {
      id: 'actions',
      cell: ({ row: { original: appointment } }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={'ghost'} size={'icon'}>
              <EllipsisVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <UpsertAppointmentFormDialog
              appointment={appointment}
              doctors={doctors}
              patients={patients}
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <EditIcon />
                Editar
              </DropdownMenuItem>
            </UpsertAppointmentFormDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
