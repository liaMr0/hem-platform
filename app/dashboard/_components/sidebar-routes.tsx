"use client";

import { BarChart } from "lucide-react";
import { BookOpen } from "lucide-react";
import { PlusCircle } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { BookA } from "lucide-react";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";

// Rutas para el administrador (acceso completo)
const adminRoutes = [
  {
    icon: BarChart,
    label: "Analíticas",
    href: "/dashboard",
  },
  {
    icon: BookOpen,
    label: "Cursos",
    href: "/dashboard/courses",
  },
  {
    icon: User,
    label: "Usuarios",
    href: "/dashboard/users",
  },
  {
    icon: BookA,
    label: "Cuestionarios",
    href: "/dashboard/quiz-sets",
  },
];

// Rutas para el instructor (acceso limitado)
const instructorRoutes = [
  {
    icon: BarChart,
    label: "Panel",
    href: "/dashboard",
  },
  {
    icon: BookOpen,
    label: "Mis Cursos",
    href: "/dashboard/courses",
  },
  {
    icon: PlusCircle,
    label: "Crear Curso",
    href: "/dashboard/courses/add",
  },
  {
    icon: BookA,
    label: "Mis Cuestionarios",
    href: "/dashboard/quiz-sets",
  },
];

export const SidebarRoutes = () => {
  const { data: session } = useSession();
  
  // Determinar qué rutas mostrar basado en el rol del usuario
  const getRoutesForRole = () => {
    const userRole = session?.user?.role;
    
    switch (userRole) {
      case 'admin':
        return adminRoutes;
      case 'instructor':
        return instructorRoutes;
      default:
        return []; // No mostrar rutas para roles no autorizados
    }
  };

  const routes = getRoutesForRole();

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};