// components/users/UserInfoSection.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Phone, User, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { IUser } from "@/model/user-model";
import { getRoleConfig, getStatusConfig } from "../../_utils/userConfig";

interface UserInfoSectionProps {
  user: IUser;
}

export function UserInfoSection({ user }: UserInfoSectionProps) {
  const statusConfig = getStatusConfig(user.status);
  const roleConfig = getRoleConfig(user.role);
  const StatusIcon = statusConfig.icon;
  const RoleIcon = roleConfig.icon;

  return (
    <div className="space-y-4">
      {/* Estados y Rol */}
      <div className="flex flex-wrap gap-2">
        <Badge className={statusConfig.color}>
          <StatusIcon className="mr-1 h-3 w-3" />
          {statusConfig.text}
        </Badge>
        <Badge className={roleConfig.color}>
          <RoleIcon className="mr-1 h-3 w-3" />
          {roleConfig.text}
        </Badge>
      </div>

      {/* Información adicional */}
      <div className="space-y-2 text-sm text-muted-foreground">
        {user.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>{user.phone}</span>
          </div>
        )}
        
        {user.designation && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{user.designation}</span>
          </div>
        )}

        {user.createdAt && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              Registrado: {format(new Date(user.createdAt), "dd MMM yyyy", { locale: es })}
            </span>
          </div>
        )}

        {user.lastLogin && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              Último acceso: {format(new Date(user.lastLogin), "dd MMM yyyy HH:mm", { locale: es })}
            </span>
          </div>
        )}
      </div>

      {/* Bio */}
      {user.bio && (
        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground line-clamp-3">{user.bio}</p>
        </div>
      )}
    </div>
  );
}