"use client";

import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { 
  MoreHorizontal, 
  User as UserIcon, 
  PlusCircle, 
  Mail, 
  Phone, 
  Briefcase, 
  FileText, 
  Edit, 
  Eye
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getFilteredUsers } from "@/app/actions/users";

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone?: string;
  bio?: string;
  socialMedia?: Record<string, string>;
  profilePicture?: string;
  designation?: string;
}

interface FilterOptions {
  firstName?: string;
  lastName?: string;
  role?: string;
  phone?: string;
  bio?: string;
  socialMedia?: Record<string, string>;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export default function UserCards() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12, // Aumentamos el límite para cards
    pages: 0
  });
  const [filters, setFilters] = useState<FilterOptions>({
    firstName: "",
    lastName: "",
    role: "",
    phone: "",
    bio: "",
    page: 1,
    limit: 12,
    sortBy: "firstName",
    sortOrder: "asc"
  });

  useEffect(() => {
    fetchUsers(filters);
  }, []);

  async function fetchUsers(filterOptions: FilterOptions) {
    try {
      setLoading(true);
      const result = await getFilteredUsers(filterOptions);
      setUsers(result.users);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    fetchUsers(newFilters);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    fetchUsers(newFilters);
  };

  const resetFilters = () => {
    const resetFilters = {
      firstName: "",
      lastName: "",
      role: "",
      phone: "",
      bio: "",
      page: 1,
      limit: 12,
      sortBy: "firstName",
      sortOrder: "asc"
    };
    setFilters(resetFilters);
    fetchUsers(resetFilters);
  };

  // Función para obtener el color del badge según el rol
  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'destructive';
      case 'moderator':
        return 'warning';
      case 'client':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-card">
          <div>
            <Label htmlFor="nameFilter">Nombre</Label>
            <div className="flex gap-2">
              <Input
                id="nameFilter"
                placeholder="Nombre"
                value={filters.firstName}
                onChange={(e) => handleFilterChange("firstName", e.target.value)}
                className="w-full"
              />
              <Input
                placeholder="Apellido"
                value={filters.lastName}
                onChange={(e) => handleFilterChange("lastName", e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="roleFilter">Rol</Label>
            <Select 
              value={filters.role} 
              onValueChange={(value) => handleFilterChange("role", value)}
            >
              <SelectTrigger id="roleFilter">
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="user">Usuario</SelectItem>
                <SelectItem value="client">Cliente</SelectItem>
                <SelectItem value="moderator">Moderador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="phoneFilter">Teléfono</Label>
            <Input
              id="phoneFilter"
              placeholder="Filtrar por teléfono"
              value={filters.phone}
              onChange={(e) => handleFilterChange("phone", e.target.value)}
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="bioFilter">Biografía</Label>
            <Input
              id="bioFilter"
              placeholder="Buscar en biografía"
              value={filters.bio}
              onChange={(e) => handleFilterChange("bio", e.target.value)}
            />
          </div>
          
          <div className="flex items-end gap-2">
            <Button variant="outline" onClick={resetFilters} className="flex-1">
              Limpiar filtros
            </Button>
            <Select 
              value={filters.sortOrder} 
              onValueChange={(value: 'asc' | 'desc') => handleFilterChange("sortOrder", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">A-Z</SelectItem>
                <SelectItem value="desc">Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Mostrando {users.length} de {pagination.total} usuarios
          </div>
          <Link href="/users/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Usuario
            </Button>
          </Link>
        </div>
      </div>

      {/* Loading indicator */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Cards grid */}
          {users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {users.map((user) => (
                <Card key={user._id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/users/${user._id}/edit`} className="flex items-center">
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/users/${user._id}`} className="flex items-center">
                              <Eye className="mr-2 h-4 w-4" /> Ver detalles
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <div className="flex gap-4 items-center mb-4">
                      <div className="h-16 w-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                        {user.profilePicture ? (
                          <Image 
                            src={user.profilePicture} 
                            alt={`${user.firstName} ${user.lastName}`}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gray-200">
                            <UserIcon size={24} className="text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-1">
                          {user.firstName} {user.lastName}
                        </CardTitle>
                        {user.designation && (
                          <CardDescription>
                            {user.designation}
                          </CardDescription>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      
                      {user.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{user.phone}</span>
                        </div>
                      )}

                      {user.bio && (
                        <div className="flex gap-2 text-sm mt-2">
                          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                          <span className="line-clamp-2 text-muted-foreground">{user.bio}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-4">
                    <div className="w-full flex justify-center gap-2">
                      {user.socialMedia && Object.keys(user.socialMedia).length > 0 ? (
                        Object.entries(user.socialMedia).slice(0, 3).map(([platform, url]) => (
                          <Button key={platform} variant="outline" size="sm" asChild className="h-8">
                            <Link href={url} target="_blank">
                              {platform}
                            </Link>
                          </Button>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">Sin redes sociales</span>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 border rounded-lg">
              <div className="text-center">
                <div className="text-muted-foreground mb-2">No hay usuarios que coincidan con los filtros</div>
                <Button variant="outline" onClick={resetFilters}>Limpiar filtros</Button>
              </div>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              Anterior
            </Button>
            
            <div className="text-sm text-muted-foreground">
              Página {pagination.page} de {pagination.pages}
            </div>
            
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
            >
              Siguiente
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
