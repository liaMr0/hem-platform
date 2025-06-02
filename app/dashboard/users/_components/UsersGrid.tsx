// app/admin/users/_components/UsersGrid.tsx
"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import { UsersGridProps } from "../_types/component-props";
import { UserCard } from "./user-card/UserCard";

export function UsersGrid({
  users,
  totalUsers,
  selectedUsers,
  hasActiveFilters,
  onUserUpdate,
  onUserDelete,
  onStatusChange,
  onEditUser,
  onToggleUserSelection,
  onToggleSelectAll,
  onResetFilters,
}: UsersGridProps) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No se encontraron usuarios</h3>
            <p className="text-muted-foreground">
              {hasActiveFilters
                ? "Intenta ajustar los filtros de búsqueda"
                : "No hay usuarios registrados en el sistema"
              }
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={onResetFilters} className="mt-4">
                Limpiar filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Header de resultados */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {users.length} de {totalUsers} usuarios
              {hasActiveFilters && " (filtrados)"}
            </p>
            
            {users.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleSelectAll}
              >
                {selectedUsers.length === users.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Grid de usuarios */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            onUserUpdate={onUserUpdate}
            onUserDelete={onUserDelete}
            currentUserRole="admin"
            currentUserId={currentUserId}
            // Props adicionales si tu UserCard las soporta
            isSelected={selectedUsers.includes(user._id)}
            onToggleSelect={() => onToggleUserSelection(user._id)}
          />
        ))}
      </div>
    </>
  );
}