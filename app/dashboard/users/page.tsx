// app/admin/users/page.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { IUser } from "@/model/user-model";
import { UserManagementSkeleton } from "./_components/UserManagementSkeleton";
import { EditUserDialog } from "./_components/EditUserDialog";
import { CreateUserDialog } from "./_components/CreateUserDialog";
import { usePermissions } from "./_hooks/usePermissions";
import { useUserFilters } from "./_hooks/useUserFilters";
import { useUserStats } from "./_hooks/useUserStats";
import { useUsers } from "./_hooks/useUsers";
import { useUserSelection } from "./_hooks/useUserSelection";
import { useBulkActions } from "./_hooks/useBulkActions";
import { BulkActionDialogState } from "./_types/dialog-types";
import { StatsCards } from "./_components/StatsCards";
import { UsersHeader } from "./_components/UsersHeader";
import { BulkActionsBar } from "./_components/BulkActionsBar";
import { FiltersSection } from "./_components/FiltersSection";
import { UsersGrid } from "./_components/UsersGrid";
import { BulkActionDialog } from "./_components/BulkActionDialog";

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Estados de diálogos
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [createUserDialog, setCreateUserDialog] = useState(false);
  const [bulkActionDialog, setBulkActionDialog] = useState<BulkActionDialogState>({
    open: false,
    action: null,
  });

  // Custom hooks
  const { isAuthorized, isLoading: authLoading } = usePermissions({
    session,
    status,
    router,
    requiredRole: 'admin',
  });

  const {
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
  } = useUserFilters();

  const {
    users,
    loading: usersLoading,
    totalUsers,
    totalPages,
    currentPage,
    setCurrentPage,
    refreshUsers,
  } = useUsers({
    session,
    filters,
    enabled: isAuthorized,
  });

  const { stats, refreshStats } = useUserStats({
    session,
    enabled: isAuthorized,
  });

  const {
    selectedUsers,
    toggleUserSelection,
    toggleSelectAll,
    clearSelection,
  } = useUserSelection(users);

  const {
    executeBulkAction,
    processing: bulkProcessing,
  } = useBulkActions({
    onSuccess: () => {
      refreshUsers();
      refreshStats();
      clearSelection();
      setBulkActionDialog({ open: false, action: null });
    },
  });

  // Handlers
  const handleUserUpdate = (updatedUser: IUser) => {
    refreshUsers();
    refreshStats();
    toast.success('Usuario actualizado correctamente');
  };

  const handleUserDelete = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          toast.info('Usuario ya eliminado');
          refreshUsers();
          return;
        }
        throw new Error('Error al eliminar el usuario');
      }

      refreshUsers();
      refreshStats();
      toast.success('Usuario eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      toast.error('Error al eliminar el usuario');
    }
  };

  const handleStatusChange = async (userId: string, newStatus: IUser['status']) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado');
      }

      refreshUsers();
      refreshStats();
      
      const statusTexts = {
        approved: 'aprobado',
        rejected: 'rechazado',
        suspended: 'suspendido',
        pending: 'pendiente'
      };
      
      toast.success(`Usuario ${statusTexts[newStatus]} correctamente`);
    } catch (error) {
      toast.error('Error al actualizar el estado del usuario');
    }
  };

  const handleUserCreated = (newUser: IUser) => {
    refreshUsers();
    refreshStats();
    toast.success(`Usuario ${newUser.firstName} ${newUser.lastName} creado correctamente`);
  };

  const handleBulkAction = (action: BulkActionDialogState['action']) => {
    if (selectedUsers.length === 0) {
      toast.error('Selecciona al menos un usuario');
      return;
    }
    setBulkActionDialog({ open: true, action });
  };

  const confirmBulkAction = async () => {
    if (!bulkActionDialog.action) return;
    
    await executeBulkAction(bulkActionDialog.action, selectedUsers);
  };

  // Loading states
  if (authLoading || usersLoading) {
    return <UserManagementSkeleton />;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <UsersHeader onCreateUser={() => setCreateUserDialog(true)} />
      
      <StatsCards stats={stats} />
      
      <FiltersSection
        filters={filters}
        onUpdateFilter={updateFilter}
        onResetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <BulkActionsBar
        selectedCount={selectedUsers.length}
        onClearSelection={clearSelection}
        onBulkAction={handleBulkAction}
        pendingCount={stats?.byStatus.pending || 0}
      />

      <UsersGrid
        users={users}
        totalUsers={totalUsers}
        selectedUsers={selectedUsers}
        hasActiveFilters={hasActiveFilters}
        onUserUpdate={handleUserUpdate}
        onUserDelete={handleUserDelete}
        onStatusChange={handleStatusChange}
        onEditUser={setEditingUser}
        onToggleUserSelection={toggleUserSelection}
        onToggleSelectAll={toggleSelectAll}
        onResetFilters={resetFilters}
      />

      {/* <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      /> */}

      {/* Dialogs */}
      <EditUserDialog
        user={editingUser}
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
        onUserUpdate={handleUserUpdate}
        currentUserRole="admin"
      />

      <CreateUserDialog
        open={createUserDialog}
        onOpenChange={setCreateUserDialog}
        onUserCreated={handleUserCreated}
      />

      <BulkActionDialog
        open={bulkActionDialog.open}
        action={bulkActionDialog.action}
        selectedCount={selectedUsers.length}
        processing={bulkProcessing}
        onConfirm={confirmBulkAction}
        onCancel={() => setBulkActionDialog({ open: false, action: null })}
      />
    </div>
  );
}