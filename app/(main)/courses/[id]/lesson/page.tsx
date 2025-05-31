// app/courses/[id]/lesson/page.tsx
import { getCourseDetails } from "@/queries/courses";
import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { getLessonBySlug } from "@/queries/lessons";
import { Separator } from "@/components/ui/separator";
import { getLoggedInUser } from "@/lib/loggedin-user";
import { redirect } from "next/navigation";
import { hasEnrollmentForCourse } from "@/queries/enrollments";
import { LessonVideo } from "./_components/lesson-video";
import VideoDescription from "./_components/video-description";

interface LessonPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string; module?: string }>;
}

const LessonPage = async ({ params, searchParams }: LessonPageProps) => {
  try {
    const { id } = await params;
    const { name, module } = await searchParams;
    
    console.log("LessonPage - Course ID:", id, "Lesson name:", name, "Module:", module);

    // Verificar autenticación
    const loggedinUser = await getLoggedInUser();
    if (!loggedinUser) {
      console.log("LessonPage - No user logged in, redirecting to login");
      redirect("/login");
    }

    // Verificar inscripción
    const isEnrolled = await hasEnrollmentForCourse(id, loggedinUser.id);
    if (!isEnrolled) {
      console.log("LessonPage - User not enrolled, redirecting to courses");
      redirect("/courses");
    }

    // Obtener detalles del curso
    const course = await getCourseDetails(id);
    
    if (!course) {
      console.log("LessonPage - Course not found");
      return (
        <div className="flex flex-col max-w-4xl mx-auto pb-20">
          <div className="p-4 w-full">
            <h1 className="text-2xl font-semibold text-red-600">
              Curso no encontrado
            </h1>
          </div>
        </div>
      );
    }

    // Si no hay nombre de lección especificado, redirigir a la primera lección
    if (!name) {
      console.log("LessonPage - No lesson name provided, finding first lesson");
      
      const allModules = replaceMongoIdInArray(course.modules || []).toSorted(
        (a, b) => a.order - b.order
      );
      
      if (allModules.length > 0) {
        const firstModule = allModules[0];
        const firstModuleLessons = firstModule?.lessonIds || [];
        
        if (firstModuleLessons.length > 0) {
          const sortedLessons = firstModuleLessons.toSorted((a, b) => a.order - b.order);
          const firstLesson = sortedLessons[0];
          
          const redirectUrl = `/courses/${id}/lesson?name=${firstLesson.slug}&module=${firstModule.slug}`;
          console.log("LessonPage - Redirecting to first lesson:", redirectUrl);
          
          redirect(redirectUrl);
        }
      }
      
      console.log("LessonPage - No lessons found, redirecting to course");
      redirect(`/courses/${id}`);
    }

    // Buscar la lección específica
    let currentLesson = null;
    let currentModule = null;

    const allModules = replaceMongoIdInArray(course.modules || []);
    
    console.log("LessonPage - Searching for lesson:", name, "in module:", module);
    
    for (const moduleItem of allModules) {
      if (module && moduleItem.slug !== module) continue;
      
      const lessons = moduleItem.lessonIds || [];
      const foundLesson = lessons.find(lesson => lesson.slug === name);
      
      if (foundLesson) {
        currentLesson = replaceMongoIdInObject(foundLesson);
        currentModule = moduleItem.slug;
        console.log("LessonPage - Found lesson:", currentLesson.title);
        break;
      }
    }

    if (!currentLesson) {
      console.log("LessonPage - Lesson not found");
      return (
        <div className="flex flex-col max-w-4xl mx-auto pb-20">
          <div className="p-4 w-full">
            <h1 className="text-2xl font-semibold text-red-600">
              Lección no encontrada
            </h1>
            <p className="mt-4 text-gray-600">
              La lección que buscas no existe o no tienes acceso a ella.
            </p>
          </div>
        </div>
      );
    }

    console.log("LessonPage - Rendering lesson:", currentLesson.title);

    return (
      <div>
        <div className="flex flex-col max-w-4xl mx-auto pb-20">
          <div className="p-4 w-full">
            <LessonVideo 
              courseId={id} 
              lesson={currentLesson} 
              module={currentModule} 
            />
          </div>
          <div>
            <div className="p-4 flex flex-col md:flex-row items-center justify-between">
              <h2 className="text-2xl font-semibold mb-2">
                {currentLesson?.title || "Lección sin título"}
              </h2>
            </div>
            <Separator />
            <VideoDescription 
              description={currentLesson?.description || "Sin descripción disponible"}
              courseId={id}
              documents={course.documents || []}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    // Log the specific error for debugging
    console.error("LessonPage - Error:", error);
    
    // Check if this is a Next.js redirect
    // Next.js redirects throw a special object, not a standard Error
    if (
      error && 
      typeof error === 'object' && 
      'digest' in error && 
      typeof error.digest === 'string' && 
      error.digest.includes('NEXT_REDIRECT')
    ) {
      console.log("LessonPage - Next.js redirect detected, re-throwing");
      throw error; // Re-throw redirect
    }
    
    // Handle other errors
    return (
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4 w-full">
          <h1 className="text-2xl font-semibold text-red-600">
            Error al cargar la lección
          </h1>
          <p className="mt-4 text-gray-600">
            Ha ocurrido un error al cargar la lección. Por favor, intenta nuevamente.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-4 p-4 bg-gray-100 text-sm overflow-auto">
              {error instanceof Error ? error.stack : String(error)}
            </pre>
          )}
        </div>
      </div>
    );
  }
};

export default LessonPage;