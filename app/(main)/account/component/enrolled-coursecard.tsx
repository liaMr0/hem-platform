import React from 'react';
import { Badge } from "@/components/ui/badge";
import { BookOpen, Award, Clock, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getReport } from '@/queries/reports';
import { CourseProgress } from '@/components/course-progress';
import { getCourseDetails } from '@/queries/courses';

interface EnrolledCourseCardProps {
  enrollment: {
    course?: {
      id?: string;
      _id?: string;
      title?: string;
      thumbnail?: string;
      modules?: any[];
    };
    student?: {
      id?: string;
      _id?: string;
    } | string;
  };
  // Add this prop to control whether the card should be wrapped in a Link
  isWrappedInLink?: boolean;
}

const EnrolledCourseCard = async ({ enrollment, isWrappedInLink = false }: EnrolledCourseCardProps) => {
  // Obtener el ID del curso correctamente
  const courseId = enrollment?.course?.id || enrollment?.course?._id;
  const studentId = enrollment?.student?.id || enrollment?.student?._id || enrollment?.student;
  
  // Validación de datos requeridos
  if (!courseId) {
    console.error('Course ID is missing in enrollment:', enrollment);
    return (
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-4 h-full">
        <div className="flex items-center justify-center h-32 bg-gray-100 rounded-md">
          <div className="text-center">
            <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-red-500 text-sm">Error: Datos del curso no disponibles</p>
          </div>
        </div>
      </div>
    );
  }

  if (!studentId) {
    console.error('Student ID is missing in enrollment:', enrollment);
    return (
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-4 h-full">
        <div className="flex items-center justify-center h-32 bg-gray-100 rounded-md">
          <div className="text-center">
            <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-red-500 text-sm">Error: Datos del estudiante no disponibles</p>
          </div>
        </div>
      </div>
    );
  }

  try {
    const filter = { course: courseId, student: studentId };
    const report = await getReport(filter);
    
    // Obtener detalles del curso
    const courseDetails = await getCourseDetails(courseId);
    const totalModuleCount = courseDetails?.modules?.length || 0;

    // Calcular progreso
    const totalCompletedModules = report?.totalCompletedModeules?.length || 0;
    const totalProgress = totalModuleCount > 0 ? (totalCompletedModules / totalModuleCount) * 100 : 0;
    
    // Calcular estadísticas de cuestionarios
    const quizzes = report?.quizAssessment?.assessments || [];
    const totalQuizzes = quizzes.length;
    const quizzesTaken = quizzes.filter((q: any) => q.attempted);
    
    // Calcular puntuación
    const totalCorrect = quizzesTaken.map((quiz: any) => {
      const item = quiz.options || [];
      return item.filter((o: any) => o.isCorrect === true && o.isSelected === true);
    }).filter((elem: any) => elem.length > 0).flat();

    const marksFromQuizzes = totalCorrect?.length * 5 || 0;
    const otherMarks = report?.quizAssessment?.otherMarks || 0;
    const totalMarks = marksFromQuizzes + otherMarks;

    // Información del curso
    const courseTitle = enrollment?.course?.title || courseDetails?.title || 'Título no disponible';
    const courseThumbnail = enrollment?.course?.thumbnail || courseDetails?.thumbnail || 'default-course.jpg';
    const courseModules = enrollment?.course?.modules?.length || totalModuleCount;

    // Determinar si el curso está completado
    const isCompleted = report?.completion_date || totalProgress === 100;

    // Card content component
    const CardContent = () => (
      <div className="group hover:shadow-lg transition-all duration-300 overflow-hidden border rounded-xl bg-white dark:bg-gray-800 h-full">
        {/* Imagen del curso */}
        <div className="relative w-full aspect-video rounded-t-xl overflow-hidden">
          <Image
            src={`/assets/images/courses/${courseThumbnail}`}
            alt={courseTitle}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Badge de estado */}
          <div className="absolute top-3 right-3">
            {isCompleted ? (
              <Badge className="bg-green-600 text-white">
                <Award className="w-3 h-3 mr-1" />
                Completado
              </Badge>
            ) : totalProgress > 0 ? (
              <Badge className="bg-blue-600 text-white">
                <TrendingUp className="w-3 h-3 mr-1" />
                En Progreso
              </Badge>
            ) : (
              <Badge variant="secondary">
                <Clock className="w-3 h-3 mr-1" />
                No Iniciado
              </Badge>
            )}
          </div>
        </div>

        {/* Contenido del curso */}
        <div className="flex flex-col p-4 space-y-4">
          {/* Título */}
          <div>
            <h3 className="text-lg font-semibold group-hover:text-blue-600 line-clamp-2 transition-colors">
              {courseTitle}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <BookOpen className="w-4 h-4" />
              <span>{courseModules} Capítulos</span>
            </div>
          </div>

          {/* Estadísticas detalladas */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <div className="text-blue-600 dark:text-blue-400 font-medium">Módulos</div>
              <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                {totalCompletedModules}/{courseModules}
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <div className="text-green-600 dark:text-green-400 font-medium">Cuestionarios</div>
              <div className="text-lg font-bold text-green-700 dark:text-green-300">
                {quizzesTaken?.length || 0}/{totalQuizzes}
              </div>
            </div>
          </div>

          {/* Puntuación */}
          {totalQuizzes > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Puntuación Total</span>
                <span className="font-bold text-lg">{totalMarks}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div>Cuestionarios: {marksFromQuizzes}</div>
                <div>Otros: {otherMarks}</div>
              </div>
            </div>
          )}

          {/* Progreso */}
          <div className="space-y-2">
            <CourseProgress
              size="default"
              value={totalProgress}
              variant={totalProgress === 100 ? "success" : totalProgress >= 75 ? "warning" : "default"}
              showIcon={true}
              showPercentage={true}
            />
          </div>

          {/* Botón de continuar - Always show as div when wrapped in Link */}
          <div className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition-colors font-medium cursor-pointer">
            {isCompleted ? 'Revisar Curso' : totalProgress > 0 ? 'Continuar Aprendiendo' : 'Comenzar Curso'}
          </div>
        </div>
      </div>
    );

    // Return content without any Link wrapper when already wrapped
    if (isWrappedInLink) {
      return <CardContent />;
    }

    // Return with Link wrapper when not wrapped by parent
    return (
      <Link href={`/courses/${courseId}`} className="block h-full">
        <CardContent />
      </Link>
    );

  } catch (error) {
    console.error('Error in EnrolledCourseCard:', error);
    return (
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-4 h-full">
        <div className="flex items-center justify-center h-32 bg-gray-100 rounded-md">
          <div className="text-center">
            <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-red-500 text-sm">Error al cargar el curso</p>
          </div>
        </div>
      </div>
    );
  }
};

export default EnrolledCourseCard;