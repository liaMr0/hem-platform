
// _components/CourseModuleList.tsx (Corregido)
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Video, FileQuestion, Radio, Clock, BookOpen } from "lucide-react";
import CourseLessonList from './CourseLessonList';

interface CourseModuleListProps {
  module: any;
  moduleIndex: number;
  isEnrolled?: boolean;
}

const CourseModuleList = ({ module, moduleIndex, isEnrolled = false }: CourseModuleListProps) => {
  // Calcular duración total del módulo
  const totalDuration = module?.lessonIds?.reduce((acc: number, lessonData: any) => {
    // Manejar tanto objetos como IDs
    const duration = typeof lessonData === 'object' ? lessonData.duration : 0;
    return acc + (duration || 0);
  }, 0) || 0;

  const formatTotalDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const lessonCount = module?.lessonIds?.length || 0;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <AccordionItem className="border-none" value={`module-${moduleIndex}`}>
        <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 hover:no-underline">
          <div className="flex items-center justify-between w-full">
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 text-base">
                Módulo {moduleIndex + 1}: {module?.title}
              </h3>
              {module?.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {module.description}
                </p>
              )}
            </div>
          </div>
        </AccordionTrigger>
        
        <AccordionContent className="px-6 pb-4">
          {/* Estadísticas del módulo */}
          <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{lessonCount} lección{lessonCount !== 1 ? 'es' : ''}</span>
            </div>
            
            {totalDuration > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatTotalDuration(totalDuration)}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              <span>Contenido en video</span>
            </div>
            
            <div className="flex items-center gap-2">
              <FileQuestion className="w-4 h-4" />
              <span>Ejercicios incluidos</span>
            </div>
          </div>

          {/* Lista de lecciones */}
          <div className="space-y-2">
            {module?.lessonIds && module.lessonIds.length > 0 ? (
              module.lessonIds.map((lessonData: any, lessonIndex: number) => {
                // Crear una key única basada en el contenido
                const key = typeof lessonData === 'object' ? 
                  (lessonData.id || lessonData._id || `lesson-${moduleIndex}-${lessonIndex}`) : 
                  lessonData;
                  
                return (
                  <CourseLessonList 
                    key={key}
                    lessonData={lessonData}
                    isEnrolled={isEnrolled}
                    moduleIndex={moduleIndex}
                    lessonIndex={lessonIndex}
                  />
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No hay lecciones disponibles en este módulo</p>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </div>
  );
};

export default CourseModuleList;
