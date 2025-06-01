// app/dashboard/courses/[courseId]/enrollments/page.tsx
import { getCourseDetails } from "@/queries/courses";
import { getEnrollmentsByCourse } from "@/queries/enrollments";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

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

    // Transformar los datos para la tabla
    const enrollmentData = enrollments?.map(enrollment => ({
      id: enrollment.id,
      studentName: enrollment.student 
        ? `${enrollment.student.firstName} ${enrollment.student.lastName}`
        : 'N/A',
      studentEmail: enrollment.student?.email || 'N/A',
      enrollmentDate: enrollment.enrollment_date,
      status: enrollment.status,
      progress: enrollment.progress || 0,
      lastAccessed: enrollment.last_accessed,
      profilePicture: enrollment.student?.profilePicture || '/assets/images/user-128.png'
    })) || [];

    console.log('Transformed enrollment data:', enrollmentData);

    if (!course) {
      return (
        <div className="p-6">
          <h2 className="text-3xl text-red-600 font-bold">Curso no encontrado</h2>
        </div>
      );
    }

    return ( 
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-3xl text-gray-700 font-bold">{course.title}</h2>
          <p className="text-gray-600 mt-2">
            Total de estudiantes matriculados: {enrollmentData.length}
          </p>
        </div>
        
        {enrollmentData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No hay estudiantes matriculados en este curso</p>
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
        <h2 className="text-3xl text-red-600 font-bold">Error</h2>
        <p className="text-red-600">Error al cargar las matriculaciones: {error.message}</p>
      </div>
    );
  }
};

export default EnrollmentsPage;