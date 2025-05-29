
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
  const { id } = await params;
  const { name, module } = await searchParams;

  // Verificar autenticación
  const loggedinUser = await getLoggedInUser();
  if (!loggedinUser) {
    redirect("/login");
  }

  // Verificar inscripción
  const isEnrolled = await hasEnrollmentForCourse(id, loggedinUser.id);
  if (!isEnrolled) {
    redirect("/courses");
  }

  try {
    const course = await getCourseDetails(id);
    
    if (!course) {
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
      const allModules = replaceMongoIdInArray(course.modules || []).toSorted(
        (a, b) => a.order - b.order
      );
      
      if (allModules.length > 0) {
        const firstModule = allModules[0];
        const firstModuleLessons = firstModule?.lessonIds || [];
        
        if (firstModuleLessons.length > 0) {
          const sortedLessons = firstModuleLessons.toSorted((a, b) => a.order - b.order);
          const firstLesson = sortedLessons[0];
          
          redirect(`/courses/${id}/lesson?name=${firstLesson.slug}&module=${firstModule.slug}`);
        }
      }
      
      redirect(`/courses/${id}`);
    }

    // Buscar la lección específica
    let currentLesson = null;
    let currentModule = null;

    const allModules = replaceMongoIdInArray(course.modules || []);
    
    for (const moduleItem of allModules) {
      if (module && moduleItem.slug !== module) continue;
      
      const lessons = moduleItem.lessonIds || [];
      const foundLesson = lessons.find(lesson => lesson.slug === name);
      
      if (foundLesson) {
        currentLesson = replaceMongoIdInObject(foundLesson);
        currentModule = moduleItem.slug;
        break;
      }
    }

    if (!currentLesson) {
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
    console.error("Error al cargar la lección:", error);
    return (
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4 w-full">
          <h1 className="text-2xl font-semibold text-red-600">
            Error al cargar la lección
          </h1>
          <p className="mt-4 text-gray-600">
            Ha ocurrido un error al cargar la lección. Por favor, intenta nuevamente.
          </p>
        </div>
      </div>
    );
  }
};

export default LessonPage;
