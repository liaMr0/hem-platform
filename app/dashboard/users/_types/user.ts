// types/user.ts
import { IUser } from "@/model/user-model";

export type UserStatus = IUser['status'];
export type UserRole = IUser['role'];

export interface UserActionHandlers {
  onUserUpdate?: (updatedUser: IUser) => void;
  onUserDelete?: (userId: string) => void;
}

export interface UserCardPermissions {
  canManageUsers: boolean;
  canEditRole: boolean;
  canDelete: boolean;
  canViewDetails: boolean;
}

export interface UserActionState {
  isUpdating: boolean;
  isDeleting: boolean;
  actionType: string;
}

export interface ApiErrorResponse {
  error: string;
  message?: string;
}

export interface UserUpdateRequest {
  status?: UserStatus;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  bio?: string;
  designation?: string;
}

// Constantes para validaciones
export const USER_ROLES = {
  ADMIN: 'admin',
  INSTRUCTOR: 'instructor', 
  STUDENT: 'student',
} as const;

export const USER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
} as const;

// Helper para validar roles
export const isValidRole = (role: string): role is UserRole => {
  return Object.values(USER_ROLES).includes(role as UserRole);
};

// Helper para validar estados
export const isValidStatus = (status: string): status is UserStatus => {
  return Object.values(USER_STATUS).includes(status as UserStatus);
};