// app/admin/users/_hooks/useUsers.ts (Updated)
import { useState, useEffect, useCallback } from "react";
import { Session } from "next-auth";
import { IUser } from "@/model/user-model";
import { UserFilters } from "../_types/filter-types";
import { UserService } from "../_services/userService";
import { USERS_PER_PAGE } from "../_utils/constants";

interface UseUsersProps {
  session: Session | null;
  filters: UserFilters;
  enabled: boolean;
}

export function useUsers({ session, filters, enabled }: UseUsersProps) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const loadUsers = useCallback(async () => {
    if (!session?.user || !enabled) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: USERS_PER_PAGE.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      if (filters.searchTerm) params.append("search", filters.searchTerm);
      if (filters.roleFilter && filters.roleFilter !== "all") {
        params.append("role", filters.roleFilter);
      }
      if (filters.statusFilter && filters.statusFilter !== "all") {
        params.append("status", filters.statusFilter);
      }

      const data = await UserService.fetchUsers(params);
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setTotalUsers(data.totalUsers);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  }, [session, enabled, currentPage, filters]);

  const refreshUsers = useCallback(() => {
    if (enabled) {
      loadUsers();
    }
  }, [enabled, loadUsers]);

  // Effect for search debouncing
  useEffect(() => {
    if (!enabled) return;

    const debounceTimer = setTimeout(() => {
      setCurrentPage(1);
      loadUsers();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [filters.searchTerm, filters.roleFilter, filters.statusFilter, filters.sortBy, filters.sortOrder, enabled, loadUsers]);

  // Effect for page changes
  useEffect(() => {
    if (enabled) {
      loadUsers();
    }
  }, [currentPage, enabled, loadUsers]);

  return {
    users,
    loading,
    totalUsers,
    totalPages,
    currentPage,
    setCurrentPage,
    refreshUsers,
  };
}