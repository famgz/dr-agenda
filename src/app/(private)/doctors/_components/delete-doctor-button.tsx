'use client';

import { deleteDoctor } from '@/actions/doctor';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Doctor } from '@/types/drizzle';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  doctor: Doctor;
}

export default function DeleteDoctorButton({ doctor }: Props) {
  const [open, setOpen] = useState(false);

  const deleteAction = useAction(deleteDoctor, {
    onSuccess: () => {
      toast.success('Médico deletado com sucesso');
      setOpen(false);
    },
    onError: (error) => {
      console.error(error);
      toast.error('Erro ao deletar médico');
    },
  });

  function handleSubmit() {
    deleteAction.execute({ id: doctor.id });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={'destructive'} type="button">
          Deletar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar médico {doctor.name}</AlertDialogTitle>
          <AlertDialogDescription>
            Deseja realmente eletar o médico {doctor.name}? Esta ação é
            irreversível.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button
            onClick={handleSubmit}
            variant={'destructive'}
            disabled={deleteAction.isPending}
          >
            Deletar Médico
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
