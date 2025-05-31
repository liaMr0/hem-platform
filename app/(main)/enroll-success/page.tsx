// Success Component actualizado (solo verificación, sin inscripción)
// app/enroll-success/page.tsx
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { getCourseDetails } from "@/queries/courses";
import { hasEnrollmentForCourse } from "@/queries/enrollments";
import { getUserByEmail } from "@/queries/users";
import { CircleCheck, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const Success = async ({ searchParams }: any) => {
    const { courseId } = await searchParams;
    
    if (!courseId) {
        redirect("/courses");
    }
    
    const userSession = await auth();
    if (!userSession?.user?.email) {
        redirect("/login");
    }

    const course = await getCourseDetails(courseId);
    const loggedInUser = await getUserByEmail(userSession?.user?.email);

    if (!course || !loggedInUser) {
        redirect("/courses");
    }

    const customerName = `${loggedInUser?.firstName} ${loggedInUser?.lastName}`;
    const productName = course?.title;

    // Solo verificar el estado de inscripción
    const isEnrolled = await hasEnrollmentForCourse(courseId, loggedInUser?.id);

    return (
        <div className="h-full w-full flex-1 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-6 max-w-[600px] text-center">
                {isEnrolled ? (
                    <>
                        <CircleCheck className="w-32 h-32 bg-green-500 rounded-full p-0 text-white" />
                        <h1 className="text-xl md:text-2xl lg:text-3xl">
                            ¡Felicidades! <strong>{customerName}</strong>, tu inscripción en <strong>{productName}</strong> fue exitosa.
                        </h1>
                        <p className="text-gray-600">
                            Ya puedes acceder a todo el contenido del curso y comenzar tu aprendizaje.
                        </p>
                    </>
                ) : (
                    <>
                        <AlertTriangle className="w-32 h-32 bg-yellow-500 rounded-full p-0 text-white" />
                        <h1 className="text-xl md:text-2xl lg:text-3xl">
                            Proceso completado con advertencias
                        </h1>
                        <p className="text-gray-600">
                            El proceso se completó, pero no pudimos confirmar tu inscripción. 
                            Por favor, intenta inscribirte nuevamente o contacta soporte.
                        </p>
                    </>
                )}

                <div className="flex items-center gap-3">
                    <Button asChild size="sm">
                        <Link href="/courses">Ver todos los cursos</Link>
                    </Button>
                    
                    {isEnrolled ? (
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/courses/${courseId}/lesson`}>Comenzar curso</Link>
                        </Button>
                    ) : (
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/courses/${courseId}`}>Ver detalles del curso</Link>
                        </Button>
                    )}
                    
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/account/enrolled-courses">Mis cursos</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Success;