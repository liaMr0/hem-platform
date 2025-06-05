// components/users/UserCard.tsx
"use client";

import { useState } from "react";
import { IUser } from "@/model/user-model";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail } from "lucide-react";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { UserDropdownMenu } from "./UserDropdownMenu";
import { UserInfoSection } from "./UserInfoSection";
import { UserAdminControls } from "./UserAdminControls";
import { useUserActions } from "../../_hooks/user-card/useUserActions";
import { getUserPermissions } from "../../_utils/userConfig";
import { EditUserDialog } from "../EditUserDialog";
import { cn } from "@/lib/utils";

interface UserCardProps {
  user: IUser;
  onUserUpdate?: (updatedUser: IUser) => void;
  onUserDelete?: (userId: string) => void;
  currentUserRole?: string;
  currentUserId?: string;
  // Props adicionales para compatibilidad con UsersGrid
  isSelected?: boolean;
  onToggleSelect?: () => void;
  showSelection?: boolean;
}

export function UserCard({ 
  user, 
  onUserUpdate, 
  onUserDelete, 
  currentUserRole = "admin",
  currentUserId,
  isSelected = false,
  onToggleSelect,
  showSelection = false,
}: UserCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Custom hook para manejar las acciones del usuario
  const {
    isUpdating,
    isDeleting,
    actionType,
    updateUserStatus,
    updateUserRole,
    deleteUser,
  } = useUserActions({ onUserUpdate, onUserDelete });

  // Obtener permisos del usuario actual
  const permissions = getUserPermissions(
    currentUserRole,
    user.role,
    currentUserId,
    user._id
  );

  // Handlers
  const handleStatusUpdate = async (newStatus: IUser['status']) => {
    await updateUserStatus(user._id, newStatus);
  };

  const handleRoleUpdate = async (newRole: IUser['role']) => {
    await updateUserRole(user._id, newRole);
  };

  const handleDelete = async () => {
    try {
      await deleteUser(user._id);
      setShowDeleteDialog(false);
    } catch (error) {
      // Error ya manejado en el hook
    }
  };

  const handleEditUser = (updatedUser: IUser) => {
    onUserUpdate?.(updatedUser);
    setShowEditDialog(false);
  };

  const isSelfCard = currentUserId === user._id;

  return (
    <>
      <Card className={cn(
        "hover:shadow-lg transition-all duration-200 relative",
        isSelected && "ring-2 ring-primary ring-offset-2",
        isSelfCard && "border-blue-200 bg-blue-50/30"
      )}>
        {/* Checkbox de selección */}
        {showSelection && onToggleSelect && (
          <div className="absolute top-3 left-3 z-10">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onToggleSelect}
              className="bg-white border-2"
            />
          </div>
        )}

        {/* Indicador de cuenta propia */}
        {isSelfCard && (
          <div className="absolute top-3 right-3 z-10">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
              Tu cuenta
            </span>
          </div>
        )}

        <CardHeader className={cn(
          "pb-4",
          showSelection && "pt-8" // Más espacio arriba si hay checkbox
        )}>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage 
                  src={user.profilePicture || "/assets/images/avatar.png"} 
                  alt={`${user.firstName} ${user.lastName}`} 
                />
                <AvatarFallback>
                  {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">
                  {user.firstName} {user.lastName}
                  {isSelfCard && (
                    <span className="ml-2 text-sm font-normal text-blue-600">(Tú)</span>
                  )}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <Mail className="h-3 w-3" />
                  {user.email}
                </CardDescription>
              </div>
            </div>

            <UserDropdownMenu
              user={user}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
              canManageUsers={permissions.canManageUsers}
              canDelete={permissions.canDelete}
              onEdit={() => setShowEditDialog(true)}
              onDelete={() => setShowDeleteDialog(true)}
              onStatusUpdate={handleStatusUpdate}
            />
          </div>
        </CardHeader>

        <CardContent>
          <UserInfoSection user={user} />
          
          <UserAdminControls
            user={user}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
            actionType={actionType}
            canManageUsers={permissions.canManageUsers}
            canEditRole={permissions.canEditRole}
            onStatusUpdate={handleStatusUpdate}
            onRoleUpdate={handleRoleUpdate}
          />
        </CardContent>
      </Card>

      {/* Dialog de edición */}
      <EditUserDialog
        user={user}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onUserUpdate={handleEditUser}
        currentUserRole={currentUserRole}
      />

      {/* Dialog de confirmación para eliminar */}
      <DeleteUserDialog
        user={user}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        currentUserId={currentUserId}
      />
    </>
  );
}