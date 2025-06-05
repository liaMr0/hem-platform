// app/admin/users/_hooks/useUserFilters.ts
import { useState, useCallback, useMemo } from 'react';

export interface UserFilters {
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  registrationDate?: string;
  lastAccess?: string;
  verification?: string;
}

const initialFilters: UserFilters = {
  searchTerm: '',
  roleFilter: 'all',
  statusFilter: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export function useUserFilters() {
  const [filters, setFilters] = useState<UserFilters>(initialFilters);

  // Memoized update function to prevent unnecessary re-renders
  const updateFilter = useCallback(<K extends keyof UserFilters>(
    key: K,
    value: UserFilters[K]
  ) => {
    setFilters(prev => {
      // Only update if value actually changed
      if (prev[key] === value) {
        return prev;
      }
      
      return {
        ...prev,
        [key]: value,
      };
    });
  }, []);

  // Memoized reset function
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  // Memoized hasActiveFilters calculation
  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchTerm !== initialFilters.searchTerm ||
      filters.roleFilter !== initialFilters.roleFilter ||
      filters.statusFilter !== initialFilters.statusFilter ||
      filters.sortBy !== initialFilters.sortBy ||
      filters.sortOrder !== initialFilters.sortOrder ||
      filters.registrationDate !== initialFilters.registrationDate ||
      filters.lastAccess !== initialFilters.lastAccess ||
      filters.verification !== initialFilters.verification
    );
  }, [filters]);

  // Memoized filters object to prevent unnecessary re-renders in consumers
  const memoizedFilters = useMemo(() => filters, [filters]);

  return {
    filters: memoizedFilters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
  };
}