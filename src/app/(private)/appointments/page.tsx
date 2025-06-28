import { getAppointments } from '@/actions/appointment';
import { getDoctors } from '@/actions/doctor';
import { getPatients } from '@/actions/patient';
import { getSessionUserClinicElseRedirect } from '@/actions/session';
import { AppointmentsTable } from '@/app/(private)/appointments/_components/appointments-table';
import UpsertAppointmentFormDialog from '@/app/(private)/appointments/_components/upsert-appointment-form-dialog';
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/page-container';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

export default async function AppointmentsPage() {
  const clinic = await getSessionUserClinicElseRedirect();

  const [
    { data: appointments = [] },
    { data: doctors = [] },
    { data: patients = [] },
  ] = await Promise.all([getAppointments(), getDoctors(), getPatients()]);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Agendamentos</PageTitle>
          <PageDescription>
            Gerencie os agendamentos da clínica{' '}
            <span className="font-semibold">{clinic.clinic.name}</span>
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <UpsertAppointmentFormDialog doctors={doctors!} patients={patients!}>
            <Button>
              <PlusIcon />
              Agendar Consulta
            </Button>
          </UpsertAppointmentFormDialog>
        </PageActions>
      </PageHeader>
      <PageContent>
        <AppointmentsTable
          appointments={appointments}
          doctors={doctors}
          patients={patients}
        />
      </PageContent>
    </PageContainer>
  );
}
