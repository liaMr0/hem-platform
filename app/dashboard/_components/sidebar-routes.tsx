"use client";

import { BarChart } from "lucide-react";

import { BookOpen } from "lucide-react";
import { PlusCircle } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { BookA } from "lucide-react";
import { User} from "lucide-react";

const routes = [
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
  // {
  //   icon: PlusCircle,
  //   label: "Agregar Curso",
  //   href: "/dashboard/courses/add",
  // },
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

export const SidebarRoutes = () => {
  // const pathname = usePathname();

  // const isTeacherPage = pathname?.includes("/teacher");

  // const routes = isTeacherPage ? teacherRoutes : guestRoutes;

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
