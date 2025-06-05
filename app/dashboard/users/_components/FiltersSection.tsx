// app/admin/users/_components/FiltersSection.tsx
"use client";

import { useState } from "react";
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

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filtros y Búsqueda</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
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
                  value={filters.searchTerm}
                  onChange={(e) => onUpdateFilter('searchTerm', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select 
                value={filters.roleFilter} 
                onValueChange={(value) => onUpdateFilter('roleFilter', value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="student">Estudiante</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={filters.statusFilter} 
                onValueChange={(value) => onUpdateFilter('statusFilter', value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="approved">Aprobado</SelectItem>
                  <SelectItem value="rejected">Rechazado</SelectItem>
                  <SelectItem value="suspended">Suspendido</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={`${filters.sortBy}-${filters.sortOrder}`} 
                onValueChange={(value) => {
                  const [field, order] = value.split('-');
                  onUpdateFilter('sortBy', field);
                  onUpdateFilter('sortOrder', order as 'asc' | 'desc');
                }}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Más recientes</SelectItem>
                  <SelectItem value="createdAt-asc">Más antiguos</SelectItem>
                  <SelectItem value="firstName-asc">Nombre A-Z</SelectItem>
                  <SelectItem value="firstName-desc">Nombre Z-A</SelectItem>
                  <SelectItem value="email-asc">Email A-Z</SelectItem>
                  <SelectItem value="email-desc">Email Z-A</SelectItem>
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
