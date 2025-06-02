// app/admin/users/_components/BulkActionsBar.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  UserCheck,
  UserX,
  Pause,
} from "lucide-react";
import { BulkActionsBarProps } from "../_types/component-props";

export function BulkActionsBar({ 
  selectedCount, 
  onClearSelection, 
  onBulkAction, 
  pendingCount 
}: BulkActionsBarProps) {
  if (selectedCount === 0) {
    return pendingCount > 0 ? (
      <div className="mb-6 flex justify-end">
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          {pendingCount} usuarios pendientes
        </Badge>
      </div>
    ) : null;
  }

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              {selectedCount} usuario{selectedCount !== 1 ? 's' : ''} seleccionado{selectedCount !== 1 ? 's' : ''}
            </span>
            <Button variant="outline" size="sm" onClick={onClearSelection}>
              Limpiar selección
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="default"
              onClick={() => onBulkAction('approve')}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Aprobar
            </Button>
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => onBulkAction('reject')}
            >
              <UserX className="mr-2 h-4 w-4" />
              Rechazar
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onBulkAction('suspend')}
            >
              <Pause className="mr-2 h-4 w-4" />
              Suspender
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => onBulkAction('delete')}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}