// app/admin/users/_types/filter-types.ts
export interface UserFilters {
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}