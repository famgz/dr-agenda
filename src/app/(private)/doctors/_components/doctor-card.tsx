import UpsertDoctorFormDialog from '@/app/(private)/doctors/_components/upsert-doctor-form-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Doctor } from '@/types/drizzle';
import { toReal } from '@/utils/money';
import { getWeekDayByNumber, reduceAppointmentTimeString } from '@/utils/time';
import { CalendarIcon, ClockIcon, DollarSignIcon } from 'lucide-react';

interface Props {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: Props) {
  const initials = doctor.name
    .split(' ')
    .map((name) => name[0].toUpperCase())
    .join('')
    .slice(0, 2);

  return (
    <Card className="w-full max-w-[500px] flex-1 gap-5 p-5">
      <CardHeader className="flex items-center gap-2 !p-0">
        <Avatar className="size-10">
          {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{doctor.name}</CardTitle>
          <CardDescription className="text-xs">
            {doctor.specialty}
          </CardDescription>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-1 flex-col gap-3 !p-0">
        <Badge variant={'outline'}>
          <CalendarIcon className="mr-1" />
          {getWeekDayByNumber(doctor.availableFromWeekDay)} a{' '}
          {getWeekDayByNumber(doctor.availableToWeekDay)}
        </Badge>
        <Badge variant={'outline'}>
          <ClockIcon className="mr-1" />
          De {reduceAppointmentTimeString(doctor.availableFromTime)} a{' '}
          {reduceAppointmentTimeString(doctor.availableToTime)}
        </Badge>
        <Badge variant={'outline'}>
          <DollarSignIcon className="mr-1" />
          {toReal(doctor.appointmentPriceInCents, 'decimal')}
        </Badge>
      </CardContent>
      <Separator />
      <CardFooter className="!p-0">
        <UpsertDoctorFormDialog doctor={doctor}>
          <Button className="w-full">Ver Detalhes</Button>
        </UpsertDoctorFormDialog>
      </CardFooter>
    </Card>
  );
}
