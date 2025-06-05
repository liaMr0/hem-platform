// _components/CourseCurriculum.tsx (Mejorado)
import React from 'react';
import { Accordion } from "@/components/ui/accordion";
import { BookOpen, Clock, Play, FileText } from 'lucide-react';
import CourseModuleList from './module/CourseModuleList';

interface CourseCurriculumProps {
  course: any;
  isEnrolled?: boolean;
}

const CourseCurriculum = ({ course, isEnrolled = true }: CourseCurriculumProps) => {
  const modules = course?.modules || [];
    
  // Calcular estadísticas totales basadas en datos reales
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
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Calcular documentos disponibles
  const totalDocuments = course?.documents?.length || 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b pb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Contenido del Curso
          </h2>
                    
          {/* Estadísticas del curso - Solo datos reales */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            {modules.length > 0 && (
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{modules.length} módulo{modules.length !== 1 ? 's' : ''}</span>
              </div>
            )}
            
            {totalLessons > 0 && (
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                <span>{totalLessons} lección{totalLessons !== 1 ? 'es' : ''}</span>
              </div>
            )}
            
            {totalDuration > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatTotalDuration(totalDuration)} de contenido</span>
              </div>
            )}

            {totalDocuments > 0 && (
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>{totalDocuments} documento{totalDocuments !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>

        {/* Documentos del curso */}
        {course?.documents && course.documents.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Documentos del Curso
            </h3>
            <div className="grid gap-3">
              {course.documents.map((doc: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm text-gray-900">{doc.fileName}</p>
                      <p className="text-xs text-gray-500">
                        {doc.fileType.toUpperCase()} • {(doc.fileSize / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Descargar
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

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