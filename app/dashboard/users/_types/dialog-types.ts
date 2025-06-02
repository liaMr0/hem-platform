import { IUser } from "@/model/user-model";

// app/admin/users/_types/dialog-types.ts
export type BulkActionType = 'approve' | 'reject' | 'suspend' | 'delete';

export interface BulkActionDialogState {
  open: boolean;
  action: BulkActionType | null;
}

export interface UserDialogState {
  editingUser: IUser | null;
  createUserDialog: boolean;
  bulkActionDialog: BulkActionDialogState;
}
