// app/admin/users/_hooks/useUserActions.ts
import { useCallback } from "react";
import { toast } from "sonner";
import { IUser } from "@/model/user-model";
import { UserService } from "../_services/userService";
import { STATUS_TEXTS } from "../_utils/constants";

interface UseUserActionsProps {
  onSuccess: () => void;
}

export function useUserActions({ onSuccess }: UseUserActionsProps) {
  const handleStatusChange = useCallback(async (userId: string, newStatus: IUser['status']) => {
    try {
      await UserService.updateUserStatus(userId, newStatus);
      onSuccess();
      toast.success(`Usuario ${STATUS_TEXTS[newStatus]} correctamente`);
    } catch (error) {
      toast.error('Error al actualizar el estado del usuario');
    }
  }, [onSuccess]);

  const handleUserDelete = useCallback(async (userId: string) => {
    try {
      await UserService.deleteUser(userId);
      onSuccess();
      toast.success('Usuario eliminado correctamente');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'USER_NOT_FOUND') {
          toast.info('Usuario ya eliminado');
          onSuccess(); // Refresh to sync state
          return;
        }
      }
      console.error('Error al eliminar usuario:', error);
      toast.error('Error al eliminar el usuario');
    }
  }, [onSuccess]);

  return {
    handleStatusChange,
    handleUserDelete,
  };
}
