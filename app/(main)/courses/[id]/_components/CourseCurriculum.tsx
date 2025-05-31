
// _components/CourseCurriculum.tsx (Actualizado)
import React from 'react';
import { Accordion } from "@/components/ui/accordion";
import CourseModuleList from './module/CourseModuleList';
import { BookOpen, Clock, Play } from 'lucide-react';

interface CourseCurriculumProps {
  course: any;
  isEnrolled?: boolean;
}

const CourseCurriculum = ({ course, isEnrolled = false }: CourseCurriculumProps) => {
  const modules = course?.modules || [];
  
  // Calcular estadísticas totales
  const totalLessons = modules.reduce((acc: number, module: any) => {
    return acc + (module?.lessonIds?.length || 0);
  }, 0);

  const totalDuration = modules.reduce((acc: number, module: any) => {
    const moduleDuration = module?.lessonIds?.reduce((modAcc: number, lessonData: any) => {
      const duration = typeof lessonData === 'object' ? lessonData.duration : 0;
      return modAcc + (duration || 0);
    }, 0) || 0;
    return acc + moduleDuration;
  }, 0);

  const formatTotalDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b pb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Contenido del Curso
          </h2>
          
          {/* Estadísticas del curso */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{modules.length} módulo{modules.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              <span>{totalLessons} lección{totalLessons !== 1 ? 'es' : ''}</span>
            </div>
            {totalDuration > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatTotalDuration(totalDuration)} de contenido</span>
              </div>
            )}
          </div>
        </div>

        {/* Módulos */}
        {modules.length > 0 ? (
          <Accordion type="single" collapsible className="space-y-4">
            {modules.map((module: any, moduleIndex: number) => (
              <CourseModuleList
                key={module.id || module._id || moduleIndex}
                module={module}
                moduleIndex={moduleIndex}
                isEnrolled={isEnrolled}
              />
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Contenido en desarrollo</h3>
            <p>El contenido de este curso se está preparando. ¡Vuelve pronto!</p>
          </div>
        )}

       
      </div>
    </div>
  );
};

export default CourseCurriculum;