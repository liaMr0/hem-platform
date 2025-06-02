// components/users/DeleteUserDialog.tsx
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
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { IUser } from "@/model/user-model";

interface DeleteUserDialogProps {
  user: IUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
  currentUserId?: string;
}

export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
  currentUserId,
}: DeleteUserDialogProps) {
  const isSelfDeletion = currentUserId === user._id;
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            ¿Estás seguro?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isSelfDeletion ? (
              <>
                <strong>¡Advertencia!</strong> Estás a punto de eliminar tu propia cuenta.
                Esta acción no se puede deshacer y perderás el acceso permanente al sistema.
              </>
            ) : (
              <>
                Esta acción no se puede deshacer. Se eliminará permanentemente la cuenta de{" "}
                <strong>{user.firstName} {user.lastName}</strong> y todos sus datos asociados.
              </>
            )}
            
            {user.role === "instructor" && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <AlertTriangle className="h-4 w-4 inline mr-1" />
                  <strong>Advertencia:</strong> Este usuario es un instructor. 
                  La eliminación podría afectar cursos y estudiantes asociados.
                </p>
              </div>
            )}
            
            {user.role === "admin" && !isSelfDeletion && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">
                  <AlertTriangle className="h-4 w-4 inline mr-1" />
                  <strong>Advertencia:</strong> Este usuario es un administrador. 
                  Asegúrate de que haya otros administradores en el sistema.
                </p>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                {isSelfDeletion ? "Eliminar Mi Cuenta" : "Eliminar Usuario"}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}