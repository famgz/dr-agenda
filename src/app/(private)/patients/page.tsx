import { getSessionUserClinicElseRedirect } from '@/actions/session';
import UpsertPatientFormDialog from '@/app/(private)/patients/_components/upsert-patient-form-dialog';
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
import { db } from '@/db';
import { patientTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { PlusIcon } from 'lucide-react';

export default async function PatientsPage() {
  const clinic = await getSessionUserClinicElseRedirect();

  const patients = await db.query.patientTable.findMany({
    where: eq(patientTable.clinicId, clinic.clinicId),
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Pacientes</PageTitle>
          <PageDescription>
            Gerencie os pacientes da clínica{' '}
            <span className="font-semibold">{clinic.clinic.name}</span>
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <UpsertPatientFormDialog>
            <Button>
              <PlusIcon />
              Adicionar Paciente
            </Button>
          </UpsertPatientFormDialog>
        </PageActions>
      </PageHeader>
      <PageContent className="grid gap-3 !space-y-0 sm:grid-cols-3 xl:grid-cols-4">
        {patients.map((patient) => (
          <div key={patient.id}>{patient.name}</div>
        ))}
      </PageContent>
    </PageContainer>
  );
}
