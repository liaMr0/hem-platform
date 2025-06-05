// app/admin/users/_hooks/useUsers.ts
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Session } from 'next-auth';
import { IUser } from '@/model/user-model';
import { UserFilters } from './useUserFilters';

interface UseUsersParams {
  session: Session | null;
  filters: UserFilters;
  enabled: boolean;
}

export function useUsers({ session, filters, enabled }: UseUsersParams) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Ref to track if component is mounted
  const isMountedRef = useRef(true);
  
  // Ref to track current request to avoid race conditions
  const currentRequestRef = useRef<AbortController | null>(null);

  // Memoized query parameters to prevent unnecessary API calls
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    
    if (filters.searchTerm) {
      params.set('search', filters.searchTerm);
    }
    if (filters.roleFilter && filters.roleFilter !== 'all') {
      params.set('role', filters.roleFilter);
    }
    if (filters.statusFilter && filters.statusFilter !== 'all') {
      params.set('status', filters.statusFilter);
    }
    if (filters.sortBy) {
      params.set('sortBy', filters.sortBy);
    }
    if (filters.sortOrder) {
      params.set('sortOrder', filters.sortOrder);
    }
    
    params.set('page', currentPage.toString());
    params.set('limit', '10'); // Or make this configurable
    
    return params.toString();
  }, [filters, currentPage]);

  const fetchUsers = useCallback(async (showLoading = true) => {
    if (!enabled || !session) return;

    // Cancel previous request
    if (currentRequestRef.current) {
      currentRequestRef.current.abort();
    }

    // Create new abort controller
    const abortController = new AbortController();
    currentRequestRef.current = abortController;

    try {
      if (showLoading) {
        setLoading(true);
      }

      const response = await fetch(`/api/users?${queryParams}`, {
        signal: abortController.signal,
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();

      // Only update state if component is still mounted and this is the current request
      if (isMountedRef.current && currentRequestRef.current === abortController) {
        setUsers(data.users || []);
        setTotalUsers(data.total || 0);
        setTotalPages(data.totalPages || 0);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was cancelled, ignore
        return;
      }
      
      console.error('Error fetching users:', error);
      
      if (isMountedRef.current && currentRequestRef.current === abortController) {
        setUsers([]);
        setTotalUsers(0);
        setTotalPages(0);
      }
    } finally {
      if (isMountedRef.current && currentRequestRef.current === abortController) {
        setLoading(false);
        currentRequestRef.current = null;
      }
    }
  }, [enabled, session, queryParams]);

  const refreshUsers = useCallback(() => {
    fetchUsers(false); // Don't show loading for refresh
  }, [fetchUsers]);

  // Optimized page change handler
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Effect to fetch users when dependencies change
  useEffect(() => {
    if (enabled) {
      fetchUsers();
    }
  }, [fetchUsers, enabled]);

  // Reset page when filters change (except search which is debounced)
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filters.roleFilter, filters.statusFilter, filters.sortBy, filters.sortOrder]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (currentRequestRef.current) {
        currentRequestRef.current.abort();
      }
    };
  }, []);

  return {
    users,
    loading,
    totalUsers,
    totalPages,
    currentPage,
    setCurrentPage: handlePageChange,
    refreshUsers,
    fetchUsers,
  };
}