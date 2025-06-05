import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";

interface UsePermissionsProps {
  session: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
  router: AppRouterInstance;
  requiredRole: string | string[]; // Ahora puede ser un string o array de strings
}

export function usePermissions({ 
  session, 
  status, 
  router, 
  requiredRole 
}: UsePermissionsProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    if (status === 'unauthenticated') {
      router.push('/login');
      setIsLoading(false);
      return;
    }
    
    if (session?.user) {
      const userRole = (session.user as any)?.role;
      
      // Verificar si el rol del usuario está autorizado
      const isRoleAuthorized = Array.isArray(requiredRole) 
        ? requiredRole.includes(userRole)
        : userRole === requiredRole;

      if (!isRoleAuthorized) {
        router.push('/dashboard');
        toast.error('No tienes permisos para acceder a esta página');
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    }
    
    setIsLoading(false);
  }, [session, status, router, requiredRole]);

  return { isAuthorized, isLoading };
}