// app/courses/_components/SearchCourse.tsx
'use client';

import { Search, X, Filter, ArrowUpDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useDebouncedCallback } from 'use-debounce';

const SearchCourse = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  const [showFilters, setShowFilters] = useState(false);

  // Función debounceada mejorada
  const debouncedSearch = useDebouncedCallback((term: string) => {
    updateUrl({ search: term });
  }, 400);

  // Función para actualizar la URL
  const updateUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value.trim()) {
        params.set(key, value.trim());
      } else {
        params.delete(key);
      }
    });
    
    startTransition(() => {
      router.push(`/courses?${params.toString()}`);
    });
  };

  // Actualizar búsqueda
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Manejar cambio de ordenamiento
  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateUrl({ sortBy: value });
  };

  // Limpiar todos los filtros
  const handleClearAll = () => {
    setSearchTerm('');
    setSortBy('newest');
    
    startTransition(() => {
      router.push('/courses');
    });
  };

  // Limpiar solo búsqueda
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = searchTerm || sortBy !== 'newest';

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda principal */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Buscar por título o descripción"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-lg"
            disabled={isPending}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
              disabled={isPending}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {isPending && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
            </div>
          )}
        </div>

        {/* Botón de filtros */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={`h-12 px-4 border-2 ${showFilters ? 'bg-blue-50 border-blue-200' : 'border-gray-200'}`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {hasActiveFilters && (
            <span className="ml-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {(searchTerm ? 1 : 0) + (sortBy !== 'newest' ? 1 : 0)}
            </span>
          )}
        </Button>
      </div>

      {/* Panel de filtros expandible */}
      {showFilters && (
        <div className="bg-white border-2 border-gray-100 rounded-lg p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Ordenar por
            </h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Limpiar todo
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordenamiento
              </label>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar orden" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Más recientes</SelectItem>
                  <SelectItem value="oldest">Más antiguos</SelectItem>
                  <SelectItem value="title">Por título (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Espacio para futuros filtros */}
            <div className="flex items-end">
              <div className="text-sm text-gray-500 italic">
                Más filtros próximamente...
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Indicador de resultados */}
      {isPending && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
          Buscando cursos...
        </div>
      )}
    </div>
  );
};

export default SearchCourse;