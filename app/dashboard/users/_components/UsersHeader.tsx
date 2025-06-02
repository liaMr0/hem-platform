// app/admin/users/_components/UsersHeader.tsx
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UsersHeaderProps } from "../_types/component-props";

export function UsersHeader({ onCreateUser }: UsersHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <p className="text-muted-foreground mt-2">
          Administra usuarios, roles y permisos del sistema
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={onCreateUser}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>
    </div>
  );
}