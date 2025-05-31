// app/courses/[id]/lesson/_components/lesson-redirect-handler.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Module {
  id: string;
  slug: string;
  order: number;
  lessonIds: Array<{
    id: string;
    slug: string;
    order: number;
    title: string;
  }>;
}

interface LessonRedirectHandlerProps {
  courseId: string;
  modules: Module[];
}

export const LessonRedirectHandler: React.FC<LessonRedirectHandlerProps> = ({ 
  courseId, 
  modules 
}) => {
  const router = useRouter();

  useEffect(() => {
    const redirectToFirstLesson = () => {
      try {
        const sortedModules = modules.toSorted((a, b) => a.order - b.order);
        
        if (sortedModules.length > 0) {
          const firstModule = sortedModules[0];
          const firstModuleLessons = firstModule?.lessonIds || [];
          
          if (firstModuleLessons.length > 0) {
            const sortedLessons = firstModuleLessons.toSorted((a, b) => a.order - b.order);
            const firstLesson = sortedLessons[0];
            
            const redirectUrl = `/courses/${courseId}/lesson?name=${firstLesson.slug}&module=${firstModule.slug}`;
            router.replace(redirectUrl);
          } else {
            // No lessons found, redirect to course page
            router.replace(`/courses/${courseId}`);
          }
        } else {
          // No modules found, redirect to course page
          router.replace(`/courses/${courseId}`);
        }
      } catch (error) {
        console.error('Error redirecting to first lesson:', error);
        router.replace(`/courses/${courseId}`);
      }
    };

    redirectToFirstLesson();
  }, [courseId, modules, router]);

  // Show loading while redirecting
  return (
    <div className="flex flex-col max-w-4xl mx-auto pb-20">
      <div className="p-4 w-full">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando lección...</p>
          </div>
        </div>
      </div>
    </div>
  );
};