// app/admin/users/_hooks/useBulkActions.ts (Updated)
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { BulkActionType } from "../_types/dialog-types";
import { UserService } from "../_services/userService";
import { BULK_ACTION_TEXTS } from "../_utils/constants";

interface UseBulkActionsProps {
  onSuccess: () => void;
}

export function useBulkActions({ onSuccess }: UseBulkActionsProps) {
  const [processing, setProcessing] = useState(false);

  const executeBulkAction = useCallback(async (
    action: BulkActionType,
    userIds: string[]
  ) => {
    if (!action || userIds.length === 0) return;

    setProcessing(true);
    
    try {
      const result = await UserService.executeBulkAction(action, userIds);
      toast.success(`${result.count} usuarios ${BULK_ACTION_TEXTS[action]} correctamente`);
      onSuccess();
    } catch (error) {
      toast.error('Error al procesar la acción masiva');
    } finally {
      setProcessing(false);
    }
  }, [onSuccess]);

  return { executeBulkAction, processing };
}