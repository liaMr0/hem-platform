import EnrolledCourseCard from "../../component/enrolled-coursecard";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/queries/users";
import { getEnrollmentsForUser } from "@/queries/enrollments";
import Link from "next/link";

async function EnrolledCourses() {
    const session = await auth();
    if (!session?.user) {
        redirect("/login");
    }

    try {
        const loggedInUser = await getUserByEmail(session?.user?.email);
        
        if (!loggedInUser?.id) {
            console.error('No se pudo obtener el usuario logueado');
            return (
                <div className="grid sm:grid-cols-2 gap-6">
                    <p className="font-bold text-red-700">Error: No se pudo cargar la información del usuario</p>
                </div>
            );
        }
         
        const enrollments = await getEnrollmentsForUser(loggedInUser.id);
        console.log("Enrollments data:", enrollments);

        // Filtrar enrollments válidos
        const validEnrollments = enrollments?.filter(enrollment => {
            const courseId = enrollment?.course?.id || enrollment?.course?._id;
            const hasValidCourse = courseId && enrollment?.course?.title;
            
            if (!hasValidCourse) {
                console.warn('Enrollment with invalid course data:', enrollment);
            }
            
            return hasValidCourse;
        }) || [];

        return (
            <div className="grid sm:grid-cols-2 gap-6">
                {validEnrollments.length > 0 ? (
                    validEnrollments.map((enrollment) => {
                        const courseId = enrollment?.course?.id || enrollment?.course?._id;
                        const enrollmentId = enrollment?.id || enrollment?._id;
                        
                        return (
                            <Link
                                key={enrollmentId}
                                href={`/courses/${courseId}/lesson`}
                                className="block h-full"
                            > 
                                <EnrolledCourseCard 
                                    enrollment={enrollment}
                                    isWrappedInLink={true}
                                />
                            </Link>
                        );
                    })
                ) : (
                    <div className="col-span-full">
                        <p className="font-bold text-red-700 text-center">
                            No se encontraron cursos matriculados
                        </p>
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('Error in EnrolledCourses:', error);
        return (
            <div className="grid sm:grid-cols-2 gap-6">
                <p className="font-bold text-red-700">Error al cargar los cursos matriculados</p>
            </div>
        );
    }
}

export default EnrolledCourses;