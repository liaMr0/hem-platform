// app/admin/users/_utils/constants.ts
export const USERS_PER_PAGE = 12;

export const STATUS_TEXTS = {
  approved: 'aprobado',
  rejected: 'rechazado',
  suspended: 'suspendido',
  pending: 'pendiente'
} as const;

export const BULK_ACTION_TEXTS = {
  approve: 'aprobados',
  reject: 'rechazados', 
  suspend: 'suspendidos',
  delete: 'eliminados'
} as const;

export const ROLE_OPTIONS = [
  { value: 'all', label: 'Todos los roles' },
  { value: 'student', label: 'Estudiante' },
  { value: 'instructor', label: 'Instructor' },
  { value: 'admin', label: 'Administrador' },
] as const;

export const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'approved', label: 'Aprobado' },
  { value: 'rejected', label: 'Rechazado' },
  { value: 'suspended', label: 'Suspendido' },
] as const;

export const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Más recientes' },
  { value: 'createdAt-asc', label: 'Más antiguos' },
  { value: 'firstName-asc', label: 'Nombre A-Z' },
  { value: 'firstName-desc', label: 'Nombre Z-A' },
  { value: 'email-asc', label: 'Email A-Z' },
  { value: 'email-desc', label: 'Email Z-A' },
] as const;