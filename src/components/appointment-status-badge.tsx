import { Badge, badgeVariants } from '@/components/ui/badge';
import { AppointmentStatus } from '@/types/drizzle';
import type { VariantProps } from 'class-variance-authority';

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;

interface Props {
  status: AppointmentStatus;
}

const statusMap: Record<
  AppointmentStatus,
  { label: string; variant: BadgeVariant }
> = {
  scheduled: {
    label: 'agendada',
    variant: 'outline',
  },
  cancelled: {
    label: 'cancelada',
    variant: 'destructive',
  },
  completed: {
    label: 'concluída',
    variant: 'default',
  },
  no_show: {
    label: 'não compareceu',
    variant: 'secondary',
  },
};

export default function AppointmentStatusBadge({ status }: Props) {
  const { label, variant } = statusMap?.[status] ?? statusMap?.scheduled;
  return <Badge variant={variant}>{label}</Badge>;
}
