'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { medicalSpecialties } from '@/constants/specialties';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';

interface Props {
  initialValue?: string;
  onSelect?: (specialty: string) => void;
}

export default function SpecialtyCardsSelect({
  onSelect,
  initialValue,
}: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(initialValue);

  const selectedItem = useMemo(
    () => medicalSpecialties.find((x) => x.label === selected),
    [selected],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'text-muted-foreground justify-start truncate px-3 font-normal',
            {
              'text-foreground': selected,
            },
          )}
        >
          {selectedItem?.label || 'Selecione uma especialidade'}
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-[min(1024px,80%)]">
        <DialogHeader>
          <DialogTitle>Especialidades Médicas</DialogTitle>
          <DialogDescription>
            Selecione uma de nossas especialidades
          </DialogDescription>
        </DialogHeader>
        <div className="flex-center mx-auto flex-wrap gap-2">
          {medicalSpecialties.map((specialty) => {
            const isSelected = selected === specialty.label;
            return (
              <Card
                key={specialty.label}
                className={cn(
                  'flex-center aspect-square size-26 cursor-pointer gap-1 p-2',
                  {
                    'border-ring ring-ring/50 bg-ring/5 ring-[3px]': isSelected,
                  },
                )}
                onClick={() => {
                  const label =
                    selected === specialty.label ? '' : specialty.label;
                  setSelected(label);
                  onSelect?.(label);
                }}
              >
                <CardHeader className="sr-only p-0">
                  <CardDescription>{specialty.label}</CardDescription>
                </CardHeader>
                <CardContent
                  className={cn(
                    'text-muted-foreground-stronger flex-center flex-col gap-2 p-0',
                    {
                      'text-foreground': isSelected,
                    },
                  )}
                >
                  <span className="text-center text-xs font-medium">
                    {specialty.label}
                  </span>
                  <specialty.icon className="size-8" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
