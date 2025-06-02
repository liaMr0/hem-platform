// components/users/UserDropdownMenu.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Pause,
  Loader2,
} from "lucide-react";
import { IUser } from "@/model/user-model";

interface UserDropdownMenuProps {
  user: IUser;
  isUpdating: boolean;
  isDeleting: boolean;
  canManageUsers: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onStatusUpdate: (status: IUser['status']) => void;
}

export function UserDropdownMenu({
  user,
  isUpdating,
  isDeleting,
  canManageUsers,
  canDelete,
  onEdit,
  onDelete,
  onStatusUpdate,
}: UserDropdownMenuProps) {
  if (!canManageUsers) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-8 w-8 p-0" 
          disabled={isUpdating || isDeleting}
        >
          <span className="sr-only">Abrir menú</span>
          {(isUpdating || isDeleting) ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MoreHorizontal className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Editar perfil
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        
        {user.status === "pending" && (
          <>
            <DropdownMenuItem
              className="text-green-600"
              onClick={() => onStatusUpdate("approved")}
              disabled={isUpdating}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Aprobar usuario
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onStatusUpdate("rejected")}
              disabled={isUpdating}
            >
              <UserX className="mr-2 h-4 w-4" />
              Rechazar usuario
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        {user.status === "approved" && (
          <>
            <DropdownMenuItem
              className="text-orange-600"
              onClick={() => onStatusUpdate("suspended")}
              disabled={isUpdating}
            >
              <Pause className="mr-2 h-4 w-4" />
              Suspender usuario
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        {(user.status === "suspended" || user.status === "rejected") && (
          <>
            <DropdownMenuItem
              className="text-green-600"
              onClick={() => onStatusUpdate("approved")}
              disabled={isUpdating}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Reactivar usuario
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        {canDelete && (
          <DropdownMenuItem
            className="text-red-600"
            onClick={onDelete}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar usuario
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}