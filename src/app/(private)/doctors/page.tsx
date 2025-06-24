import { getSessionUserElseRedirect } from '@/actions/user';
import UpsertDoctorFormDialog from '@/app/(private)/doctors/_components/upsert-doctor-form-dialog';
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

import { redirect } from 'next/navigation';

export default async function DoctorsPage() {
  const user = await getSessionUserElseRedirect();
  const clinic = user.clinic;

  if (!clinic) {
    redirect('/clinic-form');
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>Gerencie os médicos da sua clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <UpsertDoctorFormDialog>
            <Button>
              <PlusIcon />
              Adicionar Médico
            </Button>
          </UpsertDoctorFormDialog>
        </PageActions>
      </PageHeader>
      <PageContent>
        <h1>Médicos</h1>
      </PageContent>
    </PageContainer>
  );
}
