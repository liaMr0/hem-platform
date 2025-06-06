import { getCourseDetails } from "@/queries/courses";
import { getEnrollmentsByCourse } from "@/queries/enrollments";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, BookOpen } from "lucide-react";

const EnrollmentsPage = async ({ params }) => {
  const { courseId } = await params;
  
  try {
    console.log('Getting course and enrollments for courseId:', courseId);
    
    // Obtener el curso y las matriculaciones en paralelo
    const [course, enrollments] = await Promise.all([
      getCourseDetails(courseId),
      getEnrollmentsByCourse(courseId)
    ]);

    console.log('Course found:', course?.title);
    console.log('Raw enrollments:', enrollments);
    console.log('Number of enrollments:', enrollments?.length || 0);

    if (!course) {
      return (
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Link href="/dashboard/courses">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Cursos
              </Button>
            </Link>
          </div>
          <h2 className="text-3xl text-red-600 font-bold">Curso no encontrado</h2>
        </div>
      );
    }

    // Transformar los datos para la tabla con más información
    const enrollmentData = enrollments?.map(enrollment => ({
      id: enrollment.id,
      studentId: enrollment.student?.id || enrollment.student?._id,
      studentName: enrollment.student 
        ? `${enrollment.student.firstName} ${enrollment.student.lastName}`
        : 'N/A',
      studentEmail: enrollment.student?.email || 'N/A',
      enrollmentDate: enrollment.enrollment_date,
      status: enrollment.status || 'active',
      progress: enrollment.progress || 0,
      lastAccessed: enrollment.last_accessed,
      profilePicture: enrollment.student?.profilePicture || '/assets/images/avatar.png',
      quizMark: enrollment.quizMark || null,
      completionDate: enrollment.completion_date
    })) || [];

    console.log('Transformed enrollment data:', enrollmentData);

    return ( 
      <div className="p-6 space-y-6">
        {/* Encabezado */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`/dashboard/courses`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Curso
              </Button>
            </Link>
          </div>
        </div>

        {/* Información del curso */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                {course.subtitle && (
                  <p className="text-gray-600 mt-1">{course.subtitle}</p>
                )}
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  {enrollmentData.length} estudiantes matriculados
                </div>
              </div>
            </div>
            
            {course.thumbnail && (
              <img 
                src={`/assets/images/courses/${course.thumbnail}`}
                alt={course.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
            )}
          </div>
        </div>

        {/* Contenido principal */}
        {enrollmentData.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay estudiantes matriculados
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Aún no hay estudiantes inscritos en este curso. Comparte el enlace del curso 
              para que los estudiantes puedan matricularse.
            </p>
            <Button asChild>
              <Link href={`/dashboard/courses/${courseId}`}>
                Gestionar Curso
              </Link>
            </Button>
          </div>
        ) : (
          <DataTable columns={columns} data={enrollmentData} />
        )}
      </div>
    );
  } catch (error) {
    console.error('Error in EnrollmentsPage:', error);
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link href="/dashboard/courses">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Cursos
            </Button>
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error al cargar los datos</h2>
          <p className="text-red-600">
            Error al cargar las matriculaciones: {error.message}
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }
};

export default EnrollmentsPage;