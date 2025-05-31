 
import { CourseProgress } from "@/components/course-progress";
import { SidebarModules } from "./sidebar-modules";
import { getCourseDetails } from "@/queries/courses";
import { getLoggedInUser } from "@/lib/loggedin-user";
import { Watch } from "@/model/watch-model";
import { ObjectId } from "mongodb";
import { getReport } from "@/queries/reports";
import Quiz from "./quiz";

export const CourseSidebar = async ({ courseId }) => {
  // Verificar si courseId es válido
  if (!courseId) {
    return (
      <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
        <div className="p-8">
          <h1 className="font-semibold">Error: ID de curso no válido</h1>
        </div>
      </div>
    );
  }

  try {
    const course = await getCourseDetails(courseId);
    
    // Verificar si se pudo cargar el curso
    if (!course) {
      return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
          <div className="p-8">
            <h1 className="font-semibold">Curso no encontrado</h1>
          </div>
        </div>
      );
    }

    const loggedinUser = await getLoggedInUser();
    
    // Verificar si el usuario está logueado
    if (!loggedinUser || !loggedinUser.id) {
      return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
          <div className="p-8">
            <h1 className="font-semibold">{course.title || "Sin título"}</h1>
            <p className="mt-4">Por favor inicia sesión para acceder al curso.</p>
          </div>
        </div>
      );
    }

    // Obtener reporte con validación
    const report = await getReport({ course: courseId, student: loggedinUser.id });

    const totalCompletedModules = report?.totalCompletedModeules ? report.totalCompletedModeules.length : 0;
    const totalModules = course?.modules ? course.modules.length : 0;
    const totalProgress = (totalModules > 0) ? (totalCompletedModules / totalModules) * 100 : 0;

    // Verificar si hay módulos
    if (!course.modules || !Array.isArray(course.modules)) {
      return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
          <div className="p-8 flex flex-col border-b">
            <h1 className="font-semibold">{course.title || "Sin título"}</h1>
            <p className="mt-4">Este curso no tiene módulos disponibles.</p>
          </div>
        </div>
      );
    }

    // Función para sanitizar los datos
    function sanitizeData(data) {
      return JSON.parse(
        JSON.stringify(data, (key, value) => {
          if (value instanceof ObjectId) {
            return value.toString();
          }
          if (Buffer.isBuffer(value)) {
            return value.toString("base64");
          }
          return value;
        })
      );
    }

    // Procesar módulos con validaciones
    const updatedModules = await Promise.all(course.modules.map(async (module) => {
      if (!module || !module._id) return module;
      
      const moduleId = module._id.toString();
      const lessons = module?.lessonIds || [];

      // Verificar si hay lecciones
      if (Array.isArray(lessons)) {
        const updatedLessons = await Promise.all(lessons.map(async (lesson) => {
          if (!lesson || !lesson._id) return lesson;
          
          const lessonId = lesson._id.toString();
          try {
            const watch = await Watch.findOne({ 
              lesson: lessonId, 
              module: moduleId, 
              user: loggedinUser.id 
            }).lean();
            
            if (watch?.state === 'completed') {
              lesson.state = 'completed';
            }
          } catch (error) {
            console.error(`Error al verificar el estado de la lección ${lessonId}:`, error);
          }
          return lesson;
        }));
      }
      
      return module;
    }));

    const updatedallModules = sanitizeData(updatedModules);

    // Procesar quiz si existe
    const quizSetall = course?.quizSet;
    const isQuizComplete = report?.quizAssessment ? true : false;
    const quizSet = quizSetall ? sanitizeData(quizSetall) : null;

    return (
      <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
        <div className="p-8 flex flex-col border-b">
          <h1 className="font-semibold">{course.title || "Sin título"}</h1>
          <div className="mt-10">
            <CourseProgress variant="success" value={totalProgress} />
          </div>
        </div>
        
        <SidebarModules courseId={courseId} modules={updatedallModules} />

        <div className="w-full px-4 lg:px-14 pt-10 border-t">
          {quizSet && (
            <Quiz courseId={courseId} quizSet={quizSet} isTaken={isQuizComplete} />
          )}
        </div>

      </div>
    );
  } catch (error) {
    console.error("Error en CourseSidebar:", error);
    return (
      <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
        <div className="p-8">
          <h1 className="font-semibold">Error al cargar el curso</h1>
          <p className="mt-4">Por favor intenta nuevamente más tarde.</p>
        </div>
      </div>
    );
  }
};