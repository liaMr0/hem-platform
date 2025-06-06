import { CourseProgress } from "@/components/course-progress";
import { SidebarModules } from "./sidebar-modules";
import { getCourseDetails } from "@/queries/courses";
import { getLoggedInUser } from "@/lib/loggedin-user";
import { Watch } from "@/model/watch-model";
import { getReport } from "@/queries/reports";
import Quiz from "./quiz";

// Función mejorada para serializar datos de MongoDB para Next.js 15
function serializeForClient(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => serializeForClient(item));
  }
  
  if (typeof obj === 'object') {
    // Manejar ObjectId de MongoDB
    if (obj._id && typeof obj._id.toString === 'function') {
      obj._id = obj._id.toString();
    }
    
    // Si tiene método toString y parece un ObjectId, convertirlo
    if (obj.toString && obj.constructor && obj.constructor.name === 'ObjectId') {
      return obj.toString();
    }
    
    const serialized: any = {};
    
    for (const [key, value] of Object.entries(obj)) {
      // Omitir funciones y métodos problemáticos
      if (typeof value === 'function') {
        continue;
      }
      
      // Manejar campos especiales de Mongoose
      if (key === '__v' || key === '$__' || key === 'isNew' || key === '$locals' || key === '$op') {
        continue;
      }
      
      serialized[key] = serializeForClient(value);
    }
    
    return serialized;
  }
  
  return obj;
}

export const CourseSidebar = async ({ courseId }: { courseId: string }) => {
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

    // Procesar módulos con sus lecciones
    const processedModules = await Promise.all(
      course.modules.map(async (module) => {
        if (!module || !module.id) return null;
        
        const moduleId = module.id.toString();
        const lessons = module.lessonIds || [];

        // Procesar lecciones si existen
        let processedLessons: any[] = [];
        
        if (Array.isArray(lessons) && lessons.length > 0) {
          const lessonPromises = lessons.map(async (lesson) => {
            if (!lesson || !lesson.id) return null;
            
            const lessonId = lesson.id.toString();
            
            try {
              // Buscar el estado de la lección para este usuario
              const watch = await Watch.findOne({ 
                lesson: lessonId, 
                module: moduleId, 
                user: loggedinUser.id 
              }).lean();
              
              // Crear objeto de lección serializable
              return {
                id: lessonId,
                _id: lessonId, // Para compatibilidad
                title: lesson.title || "",
                slug: lesson.slug || "",
                description: lesson.description || "",
                video: lesson.video || "",
                duration: lesson.duration || 0,
                order: lesson.order || 0,
                access: lesson.access || "public",
                state: watch?.state === 'completed' ? 'completed' : 'not_started'
              };
            } catch (error) {
              console.error(`Error al procesar lección ${lessonId}:`, error);
              
              // Devolver lección básica en caso de error
              return {
                id: lessonId,
                _id: lessonId,
                title: lesson.title || "",
                slug: lesson.slug || "",
                description: lesson.description || "",
                video: lesson.video || "",
                duration: lesson.duration || 0,
                order: lesson.order || 0,
                access: lesson.access || "public",
                state: 'not_started'
              };
            }
          });
          
          const resolvedLessons = await Promise.all(lessonPromises);
          processedLessons = resolvedLessons.filter(Boolean);
        }
        
        // Crear objeto de módulo serializable
        return {
          id: moduleId,
          _id: moduleId, // Para compatibilidad
          title: module.title || "",
          slug: module.slug || "",
          description: module.description || "",
          order: module.order || 0,
          lessonIds: processedLessons
        };
      })
    );

    // Filtrar módulos válidos y serializar
    const validModules = processedModules.filter(Boolean);
    const serializedModules = serializeForClient(validModules);

    // Procesar quizSet de forma segura  
    let serializedQuizSet = null;
    const isQuizComplete = report?.quizAssessment ? true : false;

    if (course?.quizSet) {
      console.log("🔍 Processing quizSet:", course.quizSet);
      
      const rawQuizSet = course.quizSet;
      
      let processedQuizIds: any[] = [];
      
      if (rawQuizSet.quizIds && Array.isArray(rawQuizSet.quizIds)) {
        processedQuizIds = rawQuizSet.quizIds
          .map((quiz: any) => {
            // Verificar si el quiz está populated
            if (typeof quiz === 'string' || !quiz.title) {
              console.warn("⚠️ Quiz no está populated:", quiz);
              return null;
            }
            
            // Crear objeto limpio del quiz
            return {
              id: quiz.id?.toString() || quiz._id?.toString(),
              _id: quiz.id?.toString() || quiz._id?.toString(),
              title: quiz.title || "",
              description: quiz.description || "",
              options: (quiz.options || []).map((option: any) => ({
                text: option.text || "",
                is_correct: Boolean(option.is_correct)
              })).filter((opt: any) => opt.text)
            };
          })
          .filter(Boolean);
      }

      const quizSetData = {
        id: rawQuizSet.id?.toString() || rawQuizSet._id?.toString(),
        _id: rawQuizSet.id?.toString() || rawQuizSet._id?.toString(),
        title: rawQuizSet.title || "Quiz Sin Título",
        description: rawQuizSet.description || "",
        active: Boolean(rawQuizSet.active),
        quizIds: processedQuizIds
      };
      
      serializedQuizSet = serializeForClient(quizSetData);

      console.log("✅ Processed quizSet:", {
        id: serializedQuizSet.id,
        title: serializedQuizSet.title,
        quizCount: serializedQuizSet.quizIds?.length || 0,
        hasQuizzes: serializedQuizSet.quizIds && serializedQuizSet.quizIds.length > 0
      });
    }

    console.log("📊 Final data check:", {
      totalModules: serializedModules.length,
      modulesWithLessons: serializedModules.filter(m => m.lessonIds && m.lessonIds.length > 0).length,
      totalLessons: serializedModules.reduce((sum, m) => sum + (m.lessonIds?.length || 0), 0)
    });

    return (
      <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
        <div className="p-8 flex flex-col border-b">
          <h1 className="font-semibold">{course.title || "Sin título"}</h1>
          <div className="mt-10">
            <CourseProgress variant="success" value={totalProgress} />
          </div>
        </div>
        
        <SidebarModules courseId={courseId} modules={serializedModules} />

        <div className="w-full px-4 lg:px-14 pt-10 border-t">
          {serializedQuizSet && serializedQuizSet.quizIds && serializedQuizSet.quizIds.length > 0 && (
            <Quiz 
              courseId={courseId} 
              quizSet={serializedQuizSet} 
              isTaken={isQuizComplete} 
            />
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