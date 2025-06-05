// app/admin/users/_components/FiltersSection.tsx
"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  Filter,
  Eye,
  EyeOff,
} from "lucide-react";
import { FiltersSectionProps } from "../_types/component-props";
import { useDebouncedCallback } from 'use-debounce';

export function FiltersSection({ 
  filters, 
  onUpdateFilter, 
  onResetFilters, 
  hasActiveFilters 
}: FiltersSectionProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Debounced search handler
  const debouncedSearchUpdate = useDebouncedCallback(
    (value: string) => {
      onUpdateFilter('searchTerm', value);
    },
    300 // 300ms delay
  );

  // Memoized handlers to prevent unnecessary re-renders
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearchUpdate(e.target.value);
  }, [debouncedSearchUpdate]);

  const handleRoleChange = useCallback((value: string) => {
    onUpdateFilter('roleFilter', value);
  }, [onUpdateFilter]);

  const handleStatusChange = useCallback((value: string) => {
    onUpdateFilter('statusFilter', value);
  }, [onUpdateFilter]);

  const handleSortChange = useCallback((value: string) => {
    const [field, order] = value.split('-');
    onUpdateFilter('sortBy', field);
    onUpdateFilter('sortOrder', order as 'asc' | 'desc');
  }, [onUpdateFilter]);

  const handleToggleAdvanced = useCallback(() => {
    setShowAdvancedFilters(prev => !prev);
  }, []);

  // Memoized sort value to prevent recalculation
  const sortValue = useMemo(() => {
    return `${filters.sortBy}-${filters.sortOrder}`;
  }, [filters.sortBy, filters.sortOrder]);

  // Memoized role options to prevent recreation
  const roleOptions = useMemo(() => [
    { value: "all", label: "Todos los roles" },
    { value: "student", label: "Estudiante" },
    { value: "instructor", label: "Instructor" },
    { value: "admin", label: "Administrador" }
  ], []);

  // Memoized status options to prevent recreation
  const statusOptions = useMemo(() => [
    { value: "all", label: "Todos los estados" },
    { value: "pending", label: "Pendiente" },
    { value: "approved", label: "Aprobado" },
    { value: "rejected", label: "Rechazado" },
    { value: "suspended", label: "Suspendido" }
  ], []);

  // Memoized sort options to prevent recreation
  const sortOptions = useMemo(() => [
    { value: "createdAt-desc", label: "Más recientes" },
    { value: "createdAt-asc", label: "Más antiguos" },
    { value: "firstName-asc", label: "Nombre A-Z" },
    { value: "firstName-desc", label: "Nombre Z-A" },
    { value: "email-asc", label: "Email A-Z" },
    { value: "email-desc", label: "Email Z-A" }
  ], []);

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filtros y Búsqueda</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleAdvanced}
          >
            {showAdvancedFilters ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showAdvancedFilters ? 'Ocultar' : 'Mostrar'} filtros avanzados
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filtros básicos */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, email o teléfono..."
                  defaultValue={filters.searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select 
                value={filters.roleFilter} 
                onValueChange={handleRoleChange}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Rol" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={filters.statusFilter} 
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={sortValue} 
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="outline" onClick={onResetFilters}>
                  <Filter className="mr-2 h-4 w-4" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Filtros avanzados */}
          {showAdvancedFilters && (
            <div className="pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Fecha de registro</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Hoy</SelectItem>
                      <SelectItem value="week">Esta semana</SelectItem>
                      <SelectItem value="month">Este mes</SelectItem>
                      <SelectItem value="quarter">Este trimestre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Último acceso</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Actividad reciente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Hoy</SelectItem>
                      <SelectItem value="week">Esta semana</SelectItem>
                      <SelectItem value="month">Este mes</SelectItem>
                      <SelectItem value="never">Nunca</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Verificación</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Estado de verificación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="verified">Verificado</SelectItem>
                      <SelectItem value="unverified">No verificado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}