// _components/sidebar-lesson-items.tsx (corregido)
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { PlayCircle } from "lucide-react";
import { Lock } from "lucide-react";
import Link from "next/link";

interface Lesson {
  id: string;
  slug: string;
  title: string;
  access?: string;
  state?: string;
}

interface SidebarLessonItemProps {
  courseId: string;
  lesson: Lesson;
  module: string;
}

export const SidebarLessonItem = ({ courseId, lesson, module }: SidebarLessonItemProps) => {
  
  const isPrivate = (lesson: Lesson) => {
    return lesson?.access === "private";
  };
  
  const isCompleted = (lesson: Lesson) => {
    return lesson?.state === "completed";
  };

  return ( 
    <Link
      href={
        isPrivate(lesson)
          ? "#"
          : `/courses/${courseId}/lesson?name=${lesson.slug}&module=${module}`
      }
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-[500] transition-all hover:text-slate-600",
        isPrivate(lesson) 
          ? "text-slate-700 hover:text-slate-700 cursor-default" 
          : isCompleted(lesson) && "text-emerald-700 hover:text-emerald-700"
      )}
    >
      <div className="flex items-center gap-x-2">
        {isPrivate(lesson) ? (
          <Lock size={16} className={cn("text-slate-700")} />
        ) : isCompleted(lesson) ? (
          <CheckCircle size={16} className={cn("text-emerald-700")} />
        ) : (
          <PlayCircle size={16} className={cn("text-slate-700")} />
        )}
        {lesson.title}
      </div>
    </Link>
  );
};