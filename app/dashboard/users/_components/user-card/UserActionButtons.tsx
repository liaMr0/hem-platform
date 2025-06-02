// components/users/UserActionButtons.tsx
"use client";

import { Button } from "@/components/ui/button";
import { UserCheck, UserX, Pause, Loader2 } from "lucide-react";
import { IUser } from "@/model/user-model";

interface UserActionButtonsProps {
  user: IUser;
  isUpdating: boolean;
  actionType: string;
  onStatusUpdate: (status: IUser['status']) => void;
  canManageUsers: boolean;
}

export function UserActionButtons({
  user,
  isUpdating,
  actionType,
  onStatusUpdate,
  canManageUsers,
}: UserActionButtonsProps) {
  if (!canManageUsers) return null;

  const isActionLoading = (action: string) => 
    isUpdating && actionType.includes(action);

  switch (user.status) {
    case "pending":
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => onStatusUpdate("approved")}
            disabled={isUpdating}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isActionLoading("approved") ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <UserCheck className="mr-1 h-4 w-4" />
            )}
            Aprobar
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onStatusUpdate("rejected")}
            disabled={isUpdating}
            className="flex-1"
          >
            {isActionLoading("rejected") ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <UserX className="mr-1 h-4 w-4" />
            )}
            Rechazar
          </Button>
        </div>
      );

    case "rejected":
      return (
        <Button
          size="sm"
          onClick={() => onStatusUpdate("approved")}
          disabled={isUpdating}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isUpdating ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <UserCheck className="mr-1 h-4 w-4" />
          )}
          Aprobar Usuario
        </Button>
      );

    case "suspended":
      return (
        <Button
          size="sm"
          onClick={() => onStatusUpdate("approved")}
          disabled={isUpdating}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isUpdating ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <UserCheck className="mr-1 h-4 w-4" />
          )}
          Reactivar Usuario
        </Button>
      );

    case "approved":
      return (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onStatusUpdate("suspended")}
          disabled={isUpdating}
          className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50"
        >
          {isUpdating ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <Pause className="mr-1 h-4 w-4" />
          )}
          Suspender Usuario
        </Button>
      );

    default:
      return null;
  }
}