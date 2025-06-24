import { getSessionUserClinicElseRedirect } from '@/actions/session';
import DoctorCard from '@/app/(private)/doctors/_components/doctor-card';
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
import { db } from '@/db';
import { doctorTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { PlusIcon } from 'lucide-react';

export default async function DoctorsPage() {
  const clinic = await getSessionUserClinicElseRedirect();

  const doctors = await db.query.doctorTable.findMany({
    where: eq(doctorTable.clinicId, clinic.clinicId),
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>
            Gerencie os médicos da clínica{' '}
            <span className="font-semibold">{clinic.clinic.name}</span>
          </PageDescription>
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
      <PageContent className="grid gap-3 !space-y-0 sm:grid-cols-3 xl:grid-cols-4">
        {doctors.map((doctor) => (
          <DoctorCard doctor={doctor} key={doctor.id} />
        ))}
      </PageContent>
    </PageContainer>
  );
}
