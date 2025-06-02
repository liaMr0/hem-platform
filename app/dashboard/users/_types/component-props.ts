// app/admin/users/_types/component-props.ts
import { IUser } from "@/model/user-model";
import { BulkActionType } from "./dialog-types";
import { UserFilters } from "./filter-types";

export interface UsersHeaderProps {
  onCreateUser: () => void;
}

export interface StatsCardsProps {
  stats: UserStats | null;
}

export interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkAction: (action: BulkActionType) => void;
  pendingCount: number;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
export interface FiltersSectionProps {
  filters: UserFilters;
  onUpdateFilter: <K extends keyof UserFilters>(key: K, value: UserFilters[K]) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}
export interface UsersGridProps {
  users: IUser[];
  totalUsers: number;
  selectedUsers: string[];
  hasActiveFilters: boolean;
  onUserUpdate: (user: IUser) => void;
  onUserDelete: (userId: string) => void;
  onStatusChange: (userId: string, status: IUser['status']) => void;
  onEditUser: (user: IUser) => void;
  onToggleUserSelection: (userId: string) => void;
  onToggleSelectAll: () => void;
  onResetFilters: () => void;
}

export interface BulkActionDialogProps {
  open: boolean;
  action: BulkActionType | null;
  selectedCount: number;
  processing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface UserStats {
  total: number;
  byStatus: {
    pending: number;
    approved: number;
    rejected: number;
    suspended: number;
  };
  byRole: {
    student: number;
    instructor: number;
    admin: number;
  };
  recentSignups: number;
  activeThisMonth: number;
}

export interface UsersGridProps {
  users: IUser[];
  totalUsers: number;
  selectedUsers: string[];
  hasActiveFilters: boolean;
  onUserUpdate: (updatedUser: IUser) => void;
  onUserDelete: (userId: string) => void;
  onStatusChange: (userId: string, status: IUser['status']) => void;
  onEditUser: (user: IUser) => void;
  onToggleUserSelection: (userId: string) => void;
  onToggleSelectAll: () => void;
  onResetFilters: () => void;
}

export interface UserCardProps {
  user: IUser;
  onUserUpdate?: (updatedUser: IUser) => void;
  onUserDelete?: (userId: string) => void;
  currentUserRole?: string;
  currentUserId?: string;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  showSelection?: boolean;
}

export interface UserDropdownMenuProps {
  user: IUser;
  isUpdating: boolean;
  isDeleting: boolean;
  canManageUsers: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onStatusUpdate: (status: IUser['status']) => void;
}

export interface UserInfoSectionProps {
  user: IUser;
}

export interface UserAdminControlsProps {
  user: IUser;
  isUpdating: boolean;
  isDeleting: boolean;
  actionType: 'status' | 'role' | 'delete' | null;
  canManageUsers: boolean;
  canEditRole: boolean;
  onStatusUpdate: (status: IUser['status']) => void;
  onRoleUpdate: (role: IUser['role']) => void;
}

export interface EditUserDialogProps {
  user: IUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdate: (updatedUser: IUser) => void;
  currentUserRole: string;
}

export interface DeleteUserDialogProps {
  user: IUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
  currentUserId?: string;
}