// app/admin/users/_hooks/useUserFilters.ts
import { useState, useCallback } from "react";
import { UserFilters } from "../_types/filter-types";

const initialFilters: UserFilters = {
  searchTerm: "",
  roleFilter: "all",
  statusFilter: "all",
  sortBy: "createdAt",
  sortOrder: "desc",
};

export function useUserFilters() {
  const [filters, setFilters] = useState<UserFilters>(initialFilters);

  const updateFilter = useCallback(<K extends keyof UserFilters>(
    key: K,
    value: UserFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const hasActiveFilters = Boolean(
    filters.searchTerm ||
    filters.roleFilter !== "all" ||
    filters.statusFilter !== "all"
  );

  return {
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
  };
}