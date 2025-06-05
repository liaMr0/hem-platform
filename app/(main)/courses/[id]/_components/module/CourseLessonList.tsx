// _components/CourseLessonList.tsx (Mejorado - sin restricciones de pago)
import React from 'react';
import { Tv, Play, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLesson } from '@/queries/lessons';

interface CourseLessonListProps {
  lessonData: any; // Puede ser un ID string o un objeto lesson completo
  isEnrolled?: boolean;
  moduleIndex?: number;
  lessonIndex?: number;
}

const CourseLessonList = async ({ lessonData, isEnrolled = true, moduleIndex, lessonIndex }: CourseLessonListProps) => {
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
            "hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-200",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          )}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 bg-blue-100 text-blue-600">
              <Play className="w-4 h-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-gray-900 group-hover:text-blue-600 truncate">
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
            <span className="flex items-center gap-1 text-green-600 font-medium">
              <CheckCircle className="w-3 h-3" />
              Disponible
            </span>
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