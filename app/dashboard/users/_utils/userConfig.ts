// utils/userConfig.ts
import {
  CheckCircle,
  XCircle,
  Clock,
  Pause,
  Shield,
  GraduationCap,
  User,
} from 'lucide-react';

export interface StatusConfig {
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}

export interface RoleConfig {
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}

export const getStatusConfig = (status: string): StatusConfig => {
  const configs = {
    approved: {
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      icon: CheckCircle,
      text: 'Aprobado',
    },
    pending: {
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      icon: Clock,
      text: 'Pendiente',
    },
    rejected: {
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      icon: XCircle,
      text: 'Rechazado',
    },
    suspended: {
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      icon: Pause,
      text: 'Suspendido',
    },
  };

  return configs[status as keyof typeof configs] || {
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    icon: Clock,
    text: 'Desconocido',
  };
};

export const getRoleConfig = (role: string): RoleConfig => {
  const configs = {
    admin: {
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      icon: Shield,
      text: 'Administrador',
    },
    instructor: {
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      icon: GraduationCap,
      text: 'Instructor',
    },
    student: {
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      icon: User,
      text: 'Estudiante',
    },
  };

  return configs[role as keyof typeof configs] || {
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    icon: User,
    text: 'Desconocido',
  };
};

export interface UserPermissions {
  canManageUsers: boolean;
  canEditRole: boolean;
  canDelete: boolean;
}

export const getUserPermissions = (
  currentUserRole: string,
  targetUserRole: string,
  currentUserId?: string,
  targetUserId?: string
): UserPermissions => {
  const isAdmin = currentUserRole === 'admin';
  const isSameUser = currentUserId === targetUserId;
  
  return {
    canManageUsers: isAdmin,
    canEditRole: isAdmin,
    canDelete: isAdmin, // Admins pueden eliminar cualquier usuario, incluyéndose a sí mismos
  };
};