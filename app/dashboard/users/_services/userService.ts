// app/admin/users/_services/userService.ts
import { IUser } from "@/model/user-model";
import { BulkActionType } from "../_types/dialog-types";

export class UserService {
  static async updateUserStatus(userId: string, status: IUser['status']): Promise<IUser> {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el estado');
    }

    return response.json();
  }

  static async deleteUser(userId: string): Promise<void> {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('USER_NOT_FOUND');
      }
      throw new Error('Error al eliminar el usuario');
    }
  }

  static async executeBulkAction(action: BulkActionType, userIds: string[]): Promise<{ count: number }> {
    const response = await fetch(`/api/users/bulk-${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds }),
    });

    if (!response.ok) {
      throw new Error(`Error al ${action} usuarios`);
    }

    return response.json();
  }

  static async fetchUsers(params: URLSearchParams): Promise<{
    users: IUser[];
    totalUsers: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }> {
    const response = await fetch(`/api/users?${params}`);
    
    if (!response.ok) {
      throw new Error("Error al cargar usuarios");
    }

    return response.json();
  }

  static async fetchUserStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byRole: Record<string, number>;
    recentSignups: number;
    activeThisMonth: number;
  }> {
    const response = await fetch("/api/users/stats");
    
    if (!response.ok) {
      throw new Error("Error al cargar estadísticas");
    }

    return response.json();
  }
}