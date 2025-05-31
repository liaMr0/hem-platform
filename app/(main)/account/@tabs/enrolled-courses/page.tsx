// 1. Fix EnrolledCourses component - handle missing course data
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

    const loggedInUser = await getUserByEmail(session?.user?.email);
     
    const enrollments = await getEnrollmentsForUser(loggedInUser?.id)
    console.log(enrollments);

    return (
        <div className="grid sm:grid-cols-2 gap-6">
            {
                enrollments && enrollments.length > 0 ? (
                    <>
                        {enrollments.map((enrollment) => {
                            // Add safety checks for course data
                            if (!enrollment?.course?._id && !enrollment?.course?.id) {
                                console.warn('Enrollment missing course data:', enrollment);
                                return null;
                            }
                            
                            const courseId = enrollment.course._id || enrollment.course.id;
                            
                            return (
                                <Link
                                    key={enrollment?.id}
                                    href={`/courses/${courseId}/lesson`}
                                > 
                                    <EnrolledCourseCard key={enrollment?.id} enrollment={enrollment} />
                                </Link>
                            );
                        })}
                    </>
                ) : (
                    <p className="font-bold text-red-700">No se encontraron cursos matriculados</p>
                )
            }
        </div>
    );
}

export default EnrolledCourses;
