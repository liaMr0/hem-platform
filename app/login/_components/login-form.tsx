'use client'
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // Función para determinar el tipo de error basado en errorType
  const getErrorInfo = (errorMsg: string, errorType?: string) => {
    if (errorType === 'pending') {
      return {
        message: errorMsg,
        type: "warning" as const
      };
    }
    
    if (errorType === 'rejected' || errorType === 'suspended' || errorType === 'no_permission') {
      return {
        message: errorMsg,
        type: "error" as const
      };
    }
    
    return {
      message: errorMsg,
      type: "error" as const
    };
  };

  async function onSubmit(event: any) {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      console.log('Attempting login for:', email);

      // Primero, verificar credenciales y estado con nuestra API personalizada
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        // Manejar errores de la API personalizada
        console.log('Login API error:', loginData);
        
        const errorInfo = getErrorInfo(loginData.error, loginData.errorType);
        setError(errorInfo.message);
        
        if (errorInfo.type === "warning") {
          toast.warning(errorInfo.message, {
            duration: 6000,
          });
        } else {
          toast.error(errorInfo.message, {
            duration: 4000,
          });
        }
        return;
      }

      // Si la API personalizada fue exitosa, usar NextAuth para establecer la sesión
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      console.log('NextAuth signIn result:', result);

      if (result?.error) {
        // Si NextAuth falla después de que nuestra API fue exitosa, 
        // es un problema de configuración
        console.error('NextAuth error after successful API login:', result.error);
        setError("Error al establecer la sesión. Intenta nuevamente.");
        toast.error("Error al establecer la sesión");
      } else if (result?.ok) {
        toast.success("Ha iniciado sesión correctamente");
        
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 100);
      }

    } catch (e) {
      console.error('Login error:', e);
      setError("Ha ocurrido un error inesperado.");
      toast.error("Ha ocurrido un error inesperado");
    } finally {
      setIsLoading(false);
    }
  }

  // Función para determinar si es un error de advertencia
  const isWarningError = (errorMsg: string) => {
    return errorMsg.toLowerCase().includes("pendiente") || 
           errorMsg.toLowerCase().includes("aprobación");
  };

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl">
          <p className="mt-5 text-3xl font-bold leading-tight text-gray-900 sm:leading-tight sm:text-5xl lg:text-3xl lg:leading-tight font-pj">
            <span className="relative inline-flex sm:inline">
              <span className="bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
              <span className="relative dark:text-white">Inicia sesión</span>
            </span>
          </p>
        </CardTitle>
        <CardDescription>
          Ingrese su correo para acceder a su cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
            {/* {error && (
              <div className={`p-3 text-sm border rounded-md flex items-center gap-2 ${
                isWarningError(error)
                  ? "text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800 dark:text-amber-400"
                  : "text-red-500 bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800 dark:text-red-400"
              }`}>
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div> */}
            {/* )} */}
            
            <div className="grid gap-2">
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
              </div>
              <div className="relative">
                <Input 
                  className="pr-10" 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Acceder'
              )}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            ¿No tienes cuenta?{" "}
            <Link href="/register/student" className="underline">
              Registrarse
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}