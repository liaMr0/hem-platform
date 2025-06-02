// app/admin/users/_components/BulkActionDialog.tsx
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BulkActionDialogProps } from "../_types/component-props";

export function BulkActionDialog({
  open,
  action,
  selectedCount,
  processing,
  onConfirm,
  onCancel,
}: BulkActionDialogProps) {
  const getActionText = () => {
    switch (action) {
      case 'approve': return 'aprobar';
      case 'reject': return 'rechazar';
      case 'suspend': return 'suspender';
      case 'delete': return 'eliminar';
      default: return '';
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar acción masiva</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que quieres {getActionText()} {selectedCount} usuario{selectedCount !== 1 ? 's' : ''}?
            {action === 'delete' && ' Esta acción no se puede deshacer.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={processing}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={processing}
            className={action === 'delete' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {processing ? 'Procesando...' : 'Confirmar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}