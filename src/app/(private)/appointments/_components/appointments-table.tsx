'use client';

import { appointmentsTableColumns } from '@/app/(private)/appointments/_components/appointments-table-columns';
import { DataTable } from '@/components/ui/data-table';
import { AppointmentWithRelations, Doctor, Patient } from '@/types/drizzle';

interface AppointmentsTableProps {
  appointments: AppointmentWithRelations[];
  doctors: Doctor[];
  patients: Patient[];
}

export function AppointmentsTable({
  appointments,
  doctors,
  patients,
}: AppointmentsTableProps) {
  return (
    <DataTable
      columns={appointmentsTableColumns({ doctors, patients })}
      data={appointments}
    />
  );
}
