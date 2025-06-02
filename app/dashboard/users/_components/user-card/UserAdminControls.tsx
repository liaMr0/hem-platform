// components/users/UserAdminControls.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { IUser } from "@/model/user-model";
import { UserActionButtons } from "./UserActionButtons";

interface UserAdminControlsProps {
  user: IUser;
  isUpdating: boolean;
  isDeleting: boolean;
  actionType: string;
  canManageUsers: boolean;
  canEditRole: boolean;
  onStatusUpdate: (status: IUser['status']) => void;
  onRoleUpdate: (role: IUser['role']) => void;
}

export function UserAdminControls({
  user,
  isUpdating,
  isDeleting,
  actionType,
  canManageUsers,
  canEditRole,
  onStatusUpdate,
  onRoleUpdate,
}: UserAdminControlsProps) {
  if (!canManageUsers) return null;

  return (
    <div className="pt-4 border-t space-y-3">
      {/* Mensaje de estado si está actualizando */}
      {(isUpdating || isDeleting) && actionType && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{actionType}</span>
        </div>
      )}

      {/* Cambio rápido de estado */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Cambiar Estado:</label>
        <Select
          value={user.status}
          onValueChange={onStatusUpdate}
          disabled={isUpdating || isDeleting}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pendiente</SelectItem>
            <SelectItem value="approved">Aprobado</SelectItem>
            <SelectItem value="rejected">Rechazado</SelectItem>
            <SelectItem value="suspended">Suspendido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cambio de rol */}
      {canEditRole && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Cambiar Rol:</label>
          <Select
            value={user.role}
            onValueChange={onRoleUpdate}
            disabled={isUpdating || isDeleting}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Estudiante</SelectItem>
              <SelectItem value="instructor">Instructor</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Acciones rápidas */}
      <UserActionButtons
        user={user}
        isUpdating={isUpdating}
        actionType={actionType}
        onStatusUpdate={onStatusUpdate}
        canManageUsers={canManageUsers}
      />
    </div>
  );
}