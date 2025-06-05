// constants/userConstants.ts

export const USER_MESSAGES = {
  STATUS_UPDATE_SUCCESS: {
    approved: 'Usuario aprobado correctamente',
    pending: 'Usuario marcado como pendiente',
    rejected: 'Usuario rechazado correctamente',
    suspended: 'Usuario suspendido correctamente',
  },
  ROLE_UPDATE_SUCCESS: {
    admin: 'Rol actualizado a "Administrador" correctamente',
    instructor: 'Rol actualizado a "Instructor" correctamente',
    student: 'Rol actualizado a "Estudiante" correctamente',
  },
  ERRORS: {
    STATUS_UPDATE: 'Error al actualizar el estado del usuario',
    ROLE_UPDATE: 'Error al actualizar el rol del usuario',
    DELETE_USER: 'Error al eliminar el usuario',
    FETCH_FAILED: 'Error al obtener los datos del usuario',
  },
  DELETE_CONFIRMATION: {
    TITLE: '¿Estás seguro?',
    DESCRIPTION: 'Esta acción no se puede deshacer. Se eliminará permanentemente la cuenta y todos sus datos asociados.',
    SELF_DELETE_WARNING: '¡Advertencia! Estás a punto de eliminar tu propia cuenta. Esta acción no se puede deshacer y perderás el acceso permanente al sistema.',
    INSTRUCTOR_WARNING: 'Este usuario es un instructor. La eliminación podría afectar cursos y estudiantes asociados.',
    ADMIN_WARNING: 'Este usuario es un administrador. Asegúrate de que haya otros administradores en el sistema.',
  },
} as const;

export const USER_LABELS = {
  STATUS: {
    approved: 'Aprobado',
    pending: 'Pendiente', 
    rejected: 'Rechazado',
    suspended: 'Suspendido',
  },
  ROLE: {
    admin: 'Administrador',
    instructor: 'Instructor',
    student: 'Estudiante',
  },
  ACTIONS: {
    APPROVE: 'Aprobar',
    REJECT: 'Rechazar',
    SUSPEND: 'Suspender',
    REACTIVATE: 'Reactivar',
    DELETE: 'Eliminar',
    EDIT: 'Editar',
  },
} as const;

export const API_ENDPOINTS = {
  USERS: '/api/users',
  USER_BY_ID: (id: string) => `/api/users/${id}`,
} as const;

export const DEFAULT_VALUES = {
  PROFILE_PICTURE: '/assets/images/avatar.png',
  PAGE_SIZE: 10,
  DEBOUNCE_DELAY: 300,
} as const;