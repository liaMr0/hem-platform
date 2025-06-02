// hooks/useUserActions.ts
import { useState } from 'react';
import { toast } from 'sonner';
import { IUser } from '@/model/user-model';

interface UseUserActionsProps {
  onUserUpdate?: (updatedUser: IUser) => void;
  onUserDelete?: (userId: string) => void;
}

export const useUserActions = ({ onUserUpdate, onUserDelete }: UseUserActionsProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionType, setActionType] = useState<string>('');

  const updateUserStatus = async (userId: string, newStatus: IUser['status']) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    setActionType(`Actualizando estado a ${newStatus}...`);
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el estado');
      }

      const updatedUser = await response.json();
      onUserUpdate?.(updatedUser);
      
      const statusText = getStatusText(newStatus);
      toast.success(`Usuario ${statusText.toLowerCase()} correctamente`);
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error(error instanceof Error ? error.message : 'Error al actualizar el estado del usuario');
      throw error;
    } finally {
      setIsUpdating(false);
      setActionType('');
    }
  };

  const updateUserRole = async (userId: string, newRole: IUser['role']) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    setActionType(`Actualizando rol a ${newRole}...`);
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el rol');
      }

      const updatedUser = await response.json();
      onUserUpdate?.(updatedUser);
      
      const roleText = getRoleText(newRole);
      toast.success(`Rol actualizado a "${roleText}" correctamente`);
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error(error instanceof Error ? error.message : 'Error al actualizar el rol del usuario');
      throw error;
    } finally {
      setIsUpdating(false);
      setActionType('');
    }
  };

  const deleteUser = async (userId: string) => {
    if (isDeleting || !onUserDelete) return;
    
    setIsDeleting(true);
    try {
      await onUserDelete(userId);
      return true;
    } catch (error) {
      console.error('Error in delete handler:', error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isUpdating,
    isDeleting,
    actionType,
    updateUserStatus,
    updateUserRole,
    deleteUser,
  };
};

// Helper functions
const getStatusText = (status: string): string => {
  const statusMap = {
    approved: 'Aprobado',
    pending: 'Pendiente',
    rejected: 'Rechazado',
    suspended: 'Suspendido',
  };
  return statusMap[status as keyof typeof statusMap] || 'Desconocido';
};

const getRoleText = (role: string): string => {
  const roleMap = {
    admin: 'Administrador',
    instructor: 'Instructor',
    student: 'Estudiante',
  };
  return roleMap[role as keyof typeof roleMap] || 'Desconocido';
};