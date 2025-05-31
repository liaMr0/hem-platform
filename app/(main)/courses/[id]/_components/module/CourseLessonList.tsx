// _components/CourseLessonList.tsx (Corregido para manejar objetos y IDs)
import React from 'react';
import { Tv, Play, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLesson } from '@/queries/lessons';

interface CourseLessonListProps {
  lessonData: any; // Puede ser un ID string o un objeto lesson completo
  isEnrolled?: boolean;
  moduleIndex?: number;
  lessonIndex?: number;
}

const CourseLessonList = async ({ lessonData, isEnrolled = false, moduleIndex, lessonIndex }: CourseLessonListProps) => {
  try {
    let lesson;
    
    // Verificar si lessonData es un objeto completo o solo un ID
    if (typeof lessonData === 'string') {
      // Es un ID, necesitamos buscar la lección
      lesson = await getLesson(lessonData);
    } else if (lessonData && typeof lessonData === 'object') {
      // Ya es un objeto lección completo
      lesson = lessonData;
    } else {
      console.error('Invalid lesson data:', lessonData);
      return null;
    }
    
    if (!lesson) {
      return null;
    }

    const formatDuration = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
      <div className="group">
        <button
          type="button"
          className={cn(
            "flex items-center justify-between w-full p-4 text-left transition-all duration-200",
            "hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          )}
          disabled={!isEnrolled && lessonIndex !== 0}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0",
              isEnrolled || lessonIndex === 0 
                ? "bg-blue-100 text-blue-600" 
                : "bg-gray-100 text-gray-400"
            )}>
              {isEnrolled || lessonIndex === 0 ? (
                <Play className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className={cn(
                "font-medium text-sm truncate",
                isEnrolled || lessonIndex === 0 
                  ? "text-gray-900 group-hover:text-blue-600" 
                  : "text-gray-500"
              )}>
                {lesson.title}
              </h4>
              {lesson.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {lesson.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            {lesson.duration && lesson.duration > 0 && (
              <span className="flex items-center gap-1">
                <Tv className="w-3 h-3" />
                {formatDuration(lesson.duration)}
              </span>
            )}
            {!isEnrolled && lessonIndex !== 0 && (
              <span className="text-amber-600 font-medium">Premium</span>
            )}
          </div>
        </button>
      </div>
    );
  } catch (error) {
    console.error('Error loading lesson:', error);
    return (
      <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg">
        Error cargando la lección
      </div>
    );
  }
};

export default CourseLessonList;
