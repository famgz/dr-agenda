'use client';

import { deletePatient } from '@/actions/patient';
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
import { Patient } from '@/types/drizzle';
import { useAction } from 'next-safe-action/hooks';
import { ReactNode, useState } from 'react';
import { toast } from 'sonner';

interface Props {
  patient: Patient;
  children: ReactNode;
}

export default function DeletePatientDialog({ patient, children }: Props) {
  const [open, setOpen] = useState(false);

  const deleteAction = useAction(deletePatient, {
    onSuccess: () => {
      toast.success('Paciente deletado com sucesso');
      setOpen(false);
    },
    onError: (error) => {
      console.error(error);
      toast.error('Erro ao deletar paciente');
    },
  });

  function handleSubmit() {
    deleteAction.execute({ id: patient.id });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar pacient {patient.name}</AlertDialogTitle>
          <AlertDialogDescription>
            Deseja realmente eletar o paciente {patient.name}? Esta ação é
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
            Deletar Paciente
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
