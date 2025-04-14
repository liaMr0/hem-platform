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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export function SignupForm({role}:any) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const router = useRouter();

  async function onSubmit(event:any) {
    event.preventDefault();
    if (!password){
      toast.error("Escriba la contraseña.")
      return
    }
    if (password !== confirmPassword){
      toast.error("Las contraseñas no coinciden.")
      return
    }
    try {
      const formData = new FormData(event.currentTarget);
      const firstName = formData.get("first-name");
      const lastName = formData.get("last-name");
      const email = formData.get("email");
      const password = formData.get("password");

      const userRole = ((role === "student" ) || (role === "instructor")) ? role : "student";

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          userRole 
        })
      });

      response.status === 201 && router.push("/login")
      
    } catch (e) {
      console.log((e as Error).message);
    } 
  }


  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">
        <p className="mt-5 text-3xl font-bold leading-tight text-gray-900 sm:leading-tight sm:text-5xl lg:text-3xl lg:leading-tight font-pj">
       <span className="relative inline-flex sm:inline">
                <span className="bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
                <span className="relative dark:text-white">Registrarse</span>
          </span>
            </p></CardTitle>
        <CardDescription>
          Ingrese su información para crear una cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} >
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">Nombre</Label>
              <Input id="first-name" name="first-name" placeholder="Max" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Apellido</Label>
              <Input id="last-name" name="last-name"  placeholder="Robinson" required />
            </div>
          </div>
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
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input 
                onChange={(e) => setPassword(e.target.value)}
                id="password" 
                name="password" 
                type={showPassword ? "text" : "password"}
                className="pr-10" 
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <div className="relative">
              <Input 
                onChange={(e) => setConfirmPassword(e.target.value)}
                id="confirmPassword" 
                name="confirmPassword" 
                type={showPassword2 ? "text" : "password"}
                className="pr-10" 
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={() => setShowPassword2(!showPassword2)}
              >
                {showPassword2 ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Crear cuenta
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          ¿Ya tiene una cuenta?{" "}
          <Link href="/login" className="underline">
            Inicia sesión
          </Link>
        </div>
        </form>

      </CardContent>
    </Card>
  );
}
