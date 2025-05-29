"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { PlayCircle } from "lucide-react";
import { Lock } from "lucide-react";
import Link from "next/link";
import { SidebarLessons } from "./sidebar-lessons";
import { replaceMongoIdInArray } from "@/lib/convertData";
import { useSearchParams } from "next/navigation";

interface Module {
  id: string;
  title: string;
  slug: string;
  order: number;
  lessonIds: Lesson[];
}

interface Lesson {
  id: string;
  slug: string;
  title: string;
  access?: string;
  state?: string;
  order: number;
}

interface SidebarModulesProps {
  courseId: string;
  modules: Module[];
}

export const SidebarModules = ({ courseId, modules }: SidebarModulesProps) => {
  const searchParams = useSearchParams();
  
  if (!modules || !Array.isArray(modules)) {
    return (
      <div className="w-full px-6 py-4">
        <p className="text-gray-500 text-sm">No hay módulos disponibles</p>
      </div>
    );
  }

  const allModules = replaceMongoIdInArray(modules).toSorted(
    (a, b) => a.order - b.order
  );

  const query = searchParams.get("name");

  const expandModule = allModules.find((module) => {
    if (!module.lessonIds || !Array.isArray(module.lessonIds)) return false;
    
    return module.lessonIds.find((lesson) => {
      return lesson.slug === query;
    });
  });

  const expandModuleId = expandModule?.id ?? allModules[0]?.id;

  return (
    <Accordion
      defaultValue={expandModuleId}
      type="single"
      collapsible
      className="w-full px-6"
    >
      {allModules.map((module) => (
        <AccordionItem 
          key={module.id} 
          className="border-0" 
          value={module.id}
        >
          <AccordionTrigger className="text-left">
            {module.title || "Módulo sin título"}
          </AccordionTrigger>
          <SidebarLessons 
            courseId={courseId}
            lessons={module.lessonIds || []} 
            module={module.slug} 
          />
        </AccordionItem>
      ))}
    </Accordion>
  );
};