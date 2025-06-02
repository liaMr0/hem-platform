// app/admin/users/_hooks/useUserSelection.ts
import { useState, useCallback } from "react";
import { IUser } from "@/model/user-model";

export function useUserSelection(users: IUser[]) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const toggleUserSelection = useCallback((userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedUsers(prev => 
      prev.length === users.length ? [] : users.map(user => user._id)
    );
  }, [users]);

  const clearSelection = useCallback(() => {
    setSelectedUsers([]);
  }, []);

  return {
    selectedUsers,
    toggleUserSelection,
    toggleSelectAll,
    clearSelection,
  };
}