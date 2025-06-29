import { getPatients } from '@/actions/patient';
import { getSessionUserClinicElseRedirect } from '@/actions/session';
import { patientTableColumns } from '@/app/(private)/patients/_components/patient-table-columns';
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
import { DataTable } from '@/components/ui/data-table';
import { db } from '@/db';
import { patientTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { PlusIcon } from 'lucide-react';

export default async function PatientsPage() {
  const clinic = await getSessionUserClinicElseRedirect();

  const { data: patients } = await getPatients();

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
      <PageContent>
        {patients ? (
          <DataTable columns={patientTableColumns} data={patients} />
        ) : (
          <p>Erro ao requisitar lista de pacientes</p>
        )}
      </PageContent>
    </PageContainer>
  );
}
