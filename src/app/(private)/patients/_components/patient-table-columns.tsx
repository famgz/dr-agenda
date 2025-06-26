'use client';

import DeletePatientDialog from '@/app/(private)/patients/_components/delete-patient-dialog';
import UpsertPatientFormDialog from '@/app/(private)/patients/_components/upsert-patient-form-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Patient } from '@/types/drizzle';
import { formatPhoneNumber } from '@/utils/phone-number';
import { ColumnDef } from '@tanstack/react-table';
import { EditIcon, EllipsisVerticalIcon, Trash2Icon } from 'lucide-react';

export const patientTableColumns: ColumnDef<Patient>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
  },
  {
    id: 'phoneNumber',
    accessorKey: 'phoneNumber',
    header: 'Telefone',
    cell: ({
      row: {
        original: { phoneNumber },
      },
    }) => formatPhoneNumber(phoneNumber),
  },
  {
    id: 'sex',
    accessorKey: 'sex',
    header: 'Sexo',
    cell: ({
      row: {
        original: { sex },
      },
    }) => (sex === 'male' ? 'Masculino' : 'Feminino'),
  },
  {
    id: 'actions',
    cell: ({ row: { original: patient } }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'ghost'} size={'icon'}>
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{patient.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <UpsertPatientFormDialog patient={patient}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <EditIcon />
              Editar
            </DropdownMenuItem>
          </UpsertPatientFormDialog>
          <DeletePatientDialog patient={patient}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Trash2Icon />
              Excluir
            </DropdownMenuItem>
          </DeletePatientDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
