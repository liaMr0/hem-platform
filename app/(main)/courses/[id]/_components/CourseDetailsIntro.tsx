// _components/CourseDetailsIntro.tsx (Fixed)
import React from 'react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/auth';
import { getUserByEmail } from '@/queries/users';
import { hasEnrollmentForCourse } from '@/queries/enrollments';
import EnrollCourse from '@/components/enroll-course';
import { Star, Users, Clock, Award, Play } from 'lucide-react';

const CourseDetailsIntro = async ({ course }) => {
  const session = await auth();
  const loggedInUser = await getUserByEmail(session?.user?.email);
  const hasEnrollment = await hasEnrollmentForCourse(course?.id, loggedInUser?.id);

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
              <p className="text-xl text-gray-200 leading-relaxed">
                {course?.subtitle}
              </p>
            </div>

            {/* Course Stats */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span>4.8 (1,234 reseñas)</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>15,678 estudiantes</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>12 horas de contenido</span>
              </div>
            </div>

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

              <button className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white text-white hover:bg-white hover:text-blue-900 text-lg px-8 py-3"
              )}>
                <Play className="w-5 h-5 mr-2" />
                Vista Previa
              </button>
            </div>

            {/* Instructor Info */}
            <div className="flex items-center gap-4 pt-6 border-t border-white/20">
              <Image
                className="w-12 h-12 rounded-full ring-2 ring-white/30"
                src={course?.instructor?.profilePicture || '/default-avatar.png'}
                alt={`Foto de perfil de ${course?.instructor?.firstName} ${course?.instructor?.lastName}` || 'Instructor'}
                width={48}
                height={48}
              />
              <div>
                <p className="font-semibold">
                  {course?.instructor?.firstName} {course?.instructor?.lastName}
                </p>
                <p className="text-sm text-gray-300">Instructor Certificado</p>
              </div>
            </div>
          </div>

          {/* Course Preview */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                className="w-full aspect-video object-cover"
                width={600}
                height={400}
                src={`/assets/images/courses/${course?.thumbnail}`}
                alt={`Imagen de vista previa del curso: ${course?.title}` || 'Vista previa del curso'}
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <button className="w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <Play className="w-8 h-8 text-blue-900 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsIntro;