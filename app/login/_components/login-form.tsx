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
import { credentialLogin } from "@/app/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm() {

  const [error, setError] = useState('');
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event:any) {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);
      const response = await credentialLogin(formData);

      if (!!response.error) {
          console.log(response.error)
          setError("Ha ocurrido un error.");
      } else {
        toast.success("Ha iniciado sesión correctamente");
        router.push("/")
      }      
    } catch (e) {
      setError((e as Error).message);
      toast.error("Ha ocurrido un error.")
    }
  }



  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl">
        <p className="mt-5 text-3xl font-bold leading-tight text-gray-900 sm:leading-tight sm:text-5xl lg:text-3xl lg:leading-tight font-pj">
              <span className="relative inline-flex sm:inline">
                <span className="bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
                <span className="relative dark:text-white">Inicia sesión</span>
              </span>
            </p></CardTitle>
        <CardDescription>
        Ingrese su correo para acceder a su cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Contraseña</Label>
              {/* <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link> */}
            </div>
            <div className="relative">
              <Input className="pr-10" id="password" name="password" type={showPassword ? "text" : "password"} required />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full">
          Acceder
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
