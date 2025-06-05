// _components/CourseDetailsIntro.tsx (Mejorado)
import React from 'react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/auth';
import { getUserByEmail } from '@/queries/users';
import { hasEnrollmentForCourse } from '@/queries/enrollments';
import EnrollCourse from '@/components/enroll-course';
import { Users, Clock, Award, Play, BookOpen, FileText } from 'lucide-react';

const CourseDetailsIntro = async ({ course }) => {
  const session = await auth();
  const loggedInUser = await getUserByEmail(session?.user?.email);
  const hasEnrollment = await hasEnrollmentForCourse(course?.id, loggedInUser?.id);

  // Calcular estadísticas reales del curso
  const totalModules = course?.modules?.length || 0;
  const totalLessons = course?.modules?.reduce((acc: number, module: any) => {
    return acc + (module?.lessonIds?.length || 0);
  }, 0) || 0;

  const totalDuration = course?.modules?.reduce((acc: number, module: any) => {
    const moduleDuration = module?.lessonIds?.reduce((modAcc: number, lessonData: any) => {
      const duration = typeof lessonData === 'object' ? lessonData.duration : 0;
      return modAcc + (duration || 0);
    }, 0) || 0;
    return acc + moduleDuration;
  }, 0) || 0;

  const formatTotalDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const totalDocuments = course?.documents?.length || 0;

  return (
    <div className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>

      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                {course?.title}
              </h1>
              {course?.subtitle && (
                <p className="text-xl text-gray-200 leading-relaxed">
                  {course.subtitle}
                </p>
              )}
            </div>

            {/* Course Description */}
            {course?.description && (
              <p className="text-lg text-gray-300 leading-relaxed">
                {course.description}
              </p>
            )}

            {/* Course Stats - Solo datos reales */}
            <div className="flex flex-wrap gap-6 text-sm w-fit bg-white/10 backdrop-blur-sm rounded-lg p-4">
              {totalModules > 0 && (
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{totalModules} módulo{totalModules !== 1 ? 's' : ''}</span>
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

            {/* Learning Objectives */}
            {course?.learning && course.learning.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">Lo que aprenderás:</h3>
                <ul className="space-y-2">
                  {course.learning.slice(0, 4).map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Award className="w-4 h-4 mt-0.5 text-yellow-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {hasEnrollment ? (
                <Link
                  href={`/courses/${course?.id}/lesson`}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "bg-white text-blue-900 hover:bg-gray-100 text-lg px-8 py-3"
                  )}
                >
                  Continuar Aprendiendo
                </Link>
              ) : (
                <EnrollCourse courseId={course?.id} />
              )}
            </div>

            {/* Instructor Info - Solo si existe */}
            {course?.instructor && (
              <div className="flex items-center gap-4 pt-6 border-t border-white/20">
                <Image
                  className="w-12 h-12 rounded-full ring-2 ring-white/30"
                  src={course.instructor.profilePicture || '/default-avatar.png'}
                  alt={`Foto de perfil de ${course.instructor.firstName} ${course.instructor.lastName}` || 'Instructor'}
                  width={48}
                  height={48}
                />
                <div>
                  <p className="font-semibold">
                    {course.instructor.firstName} {course.instructor.lastName}
                  </p>
                  <p className="text-sm text-gray-300">Instructor</p>
                </div>
              </div>
            )}
          </div>

          {/* Course Preview - Solo si existe thumbnail */}
          {course?.thumbnail && (
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  className="w-full aspect-video object-cover"
                  width={600}
                  height={400}
                  src={`/assets/images/courses/${course.thumbnail}`}
                  alt={`Imagen de vista previa del curso: ${course.title}` || 'Vista previa del curso'}
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <button className="w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <Play className="w-8 h-8 text-blue-900 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsIntro;