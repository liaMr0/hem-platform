// app/courses/_components/CourseCard.tsx
import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { BookOpen, User, Calendar, GraduationCap } from "lucide-react";
import EnrollCourse from '@/components/enroll-course';
import { CourseProgress } from '@/components/course-progress';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    thumbnail?: string;
    modules?: Array<{
      id: string;
      title: string;
      lessonIds?: Array<{
        id: string;
        title: string;
        duration?: number;
      }>;
    }>;
    instructor?: {
      id?: string;
      firstName?: string;
      lastName?: string;
      designation?: string;
      profilePicture?: string;
    };
    testimonials?: Array<{
      rating: number;
      comment: string;
      user: {
        firstName: string;
        lastName: string;
      };
    }>;
    createdOn: string;
  };
  // Prop opcional para el progreso del usuario actual
  userProgress?: {
    progress: number;
    isCompleted: boolean;
    completedLessons: number;
    totalLessons: number;
  };
  // Prop opcional para mostrar si el usuario está inscrito
  isEnrolled?: boolean;
}

const CourseCard = ({ course, userProgress, isEnrolled = false }: CourseCardProps) => {
  // Calcular datos del curso
  const moduleCount = course?.modules?.length || 0;
  const lessonCount = course?.modules?.reduce((acc, module) => {
    return acc + (module?.lessonIds?.length || 0);
  }, 0) || 0;

  // Calcular duración total estimada (si está disponible)
  const totalDuration = course?.modules?.reduce((acc, module) => {
    const moduleDuration = module?.lessonIds?.reduce((modAcc, lesson) => {
      return modAcc + (lesson?.duration || 0);
    }, 0) || 0;
    return acc + moduleDuration;
  }, 0) || 0;

  // Formatear duración en horas y minutos
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  // Nombre completo del instructor con validación mejorada
  const getInstructorInfo = () => {
    if (!course?.instructor) {
      return {
        name: 'Instructor no disponible',
        designation: null
      };
    }

    const { firstName = '', lastName = '', designation } = course.instructor;
    const fullName = `${firstName} ${lastName}`.trim();
    
    return {
      name: fullName || 'Instructor',
      designation: designation || null
    };
  };

  const instructorInfo = getInstructorInfo();

  // Calcular rating promedio si hay testimonials
  const averageRating = course?.testimonials?.length 
    ? course.testimonials.reduce((acc, testimonial) => acc + testimonial.rating, 0) / course.testimonials.length
    : null;

  // Determinar el progreso a mostrar
  const getProgressInfo = () => {
    if (!isEnrolled) {
      return {
        value: 0,
        label: "No iniciado",
        variant: "default" as const
      };
    }

    if (!userProgress) {
      return {
        value: 0,
        label: "Sin progreso",
        variant: "default" as const
      };
    }

    const { progress, isCompleted, completedLessons, totalLessons } = userProgress;
    
    return {
      value: progress,
      label: isCompleted 
        ? "Completado" 
        : `${completedLessons}/${totalLessons} lecciones`,
      variant: isCompleted ? "success" as const : progress > 0 ? "warning" as const : "default" as const
    };
  };

  const progressInfo = getProgressInfo();

  return (
    <div className="group hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 rounded-xl bg-white h-full flex flex-col">
      <Link href={`/courses/${course.id}`} className="block flex-1">
        {/* Imagen del curso */}
        <div className="relative w-full aspect-video overflow-hidden">
          <Image
            src={course?.thumbnail 
              ? `/assets/images/courses/${course.thumbnail}` 
              : '/assets/images/placeholder-course.jpg'
            }
            alt={course?.title || 'Curso'}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badge de módulos */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-700">
            {moduleCount} módulo{moduleCount !== 1 ? 's' : ''}
          </div>

          {/* Badge de progreso si está inscrito */}
          {isEnrolled && userProgress && userProgress.progress > 0 && (
            <div className="absolute top-3 left-3 bg-green-500/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-white">
              {Math.round(userProgress.progress)}% completado
            </div>
          )}
        </div>

        {/* Contenido de la tarjeta */}
        <div className="p-5 space-y-4 flex-1">
          {/* Título y subtítulo */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold group-hover:text-blue-600 line-clamp-2 transition-colors duration-200">
              {course?.title}
            </h3>
            {course?.subtitle && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {course.subtitle}
              </p>
            )}
          </div>

          {/* Información del instructor mejorada */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4 flex-shrink-0" />
              <span className="truncate font-medium">{instructorInfo.name}</span>
            </div>
            {instructorInfo.designation && (
              <div className="flex items-center gap-2 text-xs text-gray-500 ml-6">
                <GraduationCap className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{instructorInfo.designation}</span>
              </div>
            )}
          </div>

          {/* Estadísticas del curso mejoradas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>
                    {lessonCount > 0 
                      ? `${lessonCount} lección${lessonCount !== 1 ? 'es' : ''}`
                      : `${moduleCount} módulo${moduleCount !== 1 ? 's' : ''}`
                    }
                  </span>
                </div>
                
                {totalDuration > 0 && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDuration(totalDuration)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Rating y fecha */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              {averageRating && (
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span>{averageRating.toFixed(1)}</span>
                  <span>({course.testimonials?.length})</span>
                </div>
              )}
              
              {/* {course?.createdOn && (
                <span>{formatDate(course.createdOn)}</span>
              )} */}
            </div>
          </div>

          {/* Progreso del curso mejorado */}
          <div className="pt-2">
            <CourseProgress
              size="sm"
              value={progressInfo.value}
              variant={progressInfo.variant}
              showIcon={true}
              showPercentage={isEnrolled && userProgress?.progress > 0}
              label={progressInfo.label}
            />
          </div>
        </div>
      </Link>

      {/* Botón de inscripción */}
      <div className="px-5 pb-5 mt-auto">
        <EnrollCourse 
          asLink={true} 
          courseId={course?.id}
        />
      </div>
    </div>
  );
};

export default CourseCard;