import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Funciones utilitarias
export function getStatusActionText(status: IUser['status']): string {
  const actions = {
    pending: 'marcar como pendiente',
    approved: 'aprobar',
    rejected: 'rechazar', 
    suspended: 'suspender'
  };
  return actions[status];
}

export function getRoleActionText(role: IUser['role']): string {
  const actions = {
    student: 'cambiar a estudiante',
    instructor: 'cambiar a instructor',
    admin: 'cambiar a administrador'
  };
  return actions[role];
}

export function getStatusLabel(status: IUser['status']): string {
  const labels = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    suspended: 'Suspendido'
  };
  return labels[status];
}

export function getRoleLabel(role: IUser['role']): string {
  const labels = {
    student: 'Estudiante',
    instructor: 'Instructor', 
    admin: 'Administrador'
  };
  return labels[role];
}

