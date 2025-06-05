// app/courses/page.tsx - Versión corregida para Next.js 15
import SearchCourse from "./_components/SearchCourse";
import CourseCard from "./_components/CourseCard";
import { searchCourses, getCourseProgressStats } from "@/queries/courses";
import { getEnrollmentsForUser } from "@/queries/enrollments";
import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/auth";

interface CoursesPageProps {
  searchParams: Promise<{
    search?: string;
    sortBy?: 'newest' | 'oldest' | 'title';
  }>;
}

const CoursesPage = async ({ searchParams }: CoursesPageProps) => {
  // ✅ CORREGIDO: Await searchParams antes de usar sus propiedades
  const { search, sortBy } = await searchParams;
  
  // Obtener sesión del usuario actual
  const session = await auth();
  const userId = session?.user?.id;

  // Usar la función searchCourses en lugar de getCourseList + filtrado manual
  const courses = await searchCourses({
    search: search, // Usar la variable desestructurada
    sortBy: sortBy || 'newest' // Usar la variable desestructurada
  });

  // Obtener enrollments del usuario si está autenticado
  let userEnrollments: any[] = [];
  let courseProgressMap: Record<string, any> = {};
  
  if (userId) {
    try {
      userEnrollments = await getEnrollmentsForUser(userId);
      
      // Crear un mapa de progreso para cada curso inscrito
      const progressPromises = userEnrollments.map(async (enrollment) => {
        const courseId = typeof enrollment.course === 'string' 
          ? enrollment.course 
          : enrollment.course?.id || enrollment.course?._id;
          
        if (courseId) {
          const progress = await getCourseProgressStats(courseId, userId);
          return { courseId, progress };
        }
        return null;
      });

      const progressResults = await Promise.all(progressPromises);
      
      // Convertir array a objeto para búsqueda rápida
      progressResults.forEach(result => {
        if (result && result.progress) {
          courseProgressMap[result.courseId] = result.progress;
        }
      });
    } catch (error) {
      console.error('Error getting user enrollments or progress:', error);
      // Continuar sin datos de progreso si hay error
    }
  }

  // Crear set de cursos inscritos para búsqueda rápida
  const enrolledCourseIds = new Set(
    userEnrollments.map(enrollment => {
      const courseId = typeof enrollment.course === 'string' 
        ? enrollment.course 
        : enrollment.course?.id || enrollment.course?._id;
      return courseId;
    }).filter(Boolean)
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Container con márgenes mejorados */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header mejorado */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Cursos Disponibles
              </h1>
              {courses.length > 0 && (
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    {courses.length} curso{courses.length !== 1 ? 's' : ''} encontrado{courses.length !== 1 ? 's' : ''}
                  </span>
                  {userId && enrolledCourseIds.size > 0 && (
                    <span className="text-blue-600 font-medium">
                      • {enrolledCourseIds.size} inscrito{enrolledCourseIds.size !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {/* Buscador mejorado */}
            <div className="lg:w-96">
              <Suspense fallback={
                <div className="animate-pulse bg-gray-200 h-12 rounded-lg"></div>
              }>
                <SearchCourse />
              </Suspense>
            </div>
          </div>
          
          {/* Separador */}
          <div className="mt-8 border-b border-gray-200"></div>
        </div>

        {/* Contenido principal */}
        <main className="space-y-8">
          {/* Filtros activos */}
          {(search || (sortBy && sortBy !== 'newest')) && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600">Filtros activos:</span>
              {search && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Búsqueda: "{search}"
                </span>
              )}
              {sortBy && sortBy !== 'newest' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Orden: {
                    sortBy === 'title' ? 'Por título' : 
                    sortBy === 'oldest' ? 'Más antiguos' : 'Más recientes'
                  }
                </span>
              )}
            </div>
          )}

          {/* Grid de cursos mejorado */}
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => {
                const isEnrolled = enrolledCourseIds.has(course.id);
                const userProgress = courseProgressMap[course.id] || null;
                
                return (
                  <CourseCard 
                    key={course.id} 
                    course={course}
                    userProgress={userProgress}
                    isEnrolled={isEnrolled}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No se encontraron cursos
                </h3>
                <p className="text-gray-600 mb-4">
                  {search 
                    ? `No hay cursos que coincidan con "${search}"`
                    : "No hay cursos que coincidan con tu búsqueda actual"
                  }
                </p>
                <Link 
                  href="/courses"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Ver todos los cursos
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CoursesPage;