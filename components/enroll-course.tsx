// components/enroll-course.tsx - Componente actualizado
"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface EnrollCourseProps {
    asLink?: boolean;
    courseId: string;
}

const EnrollCourse: React.FC<EnrollCourseProps> = ({ asLink, courseId }) => {
    const router = useRouter();
    const { data: session, status } = useSession();
    
    const [isLoading, setIsLoading] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);
    const [checkingEnrollment, setCheckingEnrollment] = useState(true);

    // Obtener ID de usuario de la sesión
    const userId = session?.user?.id || session?.user?.email;

    useEffect(() => {
        const checkEnrollmentStatus = async () => {
            // Esperar a que la sesión se cargue
            if (status === 'loading') {
                return;
            }

            // Si no hay usuario logueado, no verificar enrollment
            if (!userId) {
                setCheckingEnrollment(false);
                setIsEnrolled(false);
                return;
            }

            try {
                const response = await fetch(`/api/enrollments/check`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        courseId,
                        userId: userId
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsEnrolled(data.isEnrolled);
                } else {
                    console.error('Error checking enrollment status');
                    setIsEnrolled(false);
                }
            } catch (error) {
                console.error('Error checking enrollment:', error);
                setIsEnrolled(false);
            } finally {
                setCheckingEnrollment(false);
            }
        };

        checkEnrollmentStatus();
    }, [courseId, userId, status]);

    const handleEnrollment = async (formData: FormData) => {
        // Verificar autenticación
        if (!userId) {
            toast.error('Por favor inicia sesión para inscribirte en cursos');
            router.push('/login');
            return;
        }

        // Verificación adicional antes de proceder
        if (isEnrolled) {
            toast.info('Ya estás inscrito en este curso');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/enrollments/enroll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseId,
                    userId: userId
                })
            });

            const data = await response.json();

            // Manejar respuesta específica para inscripción duplicada
            if (response.status === 409 || data.code === 'ALREADY_ENROLLED') {
                setIsEnrolled(true);
                toast.warning('Ya estás inscrito en este curso', {
                    description: 'Puedes acceder al curso desde tu panel de cursos'
                });
                return;
            }

            // Manejar errores de respuesta
            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Error en la inscripción');
            }

            // Inscripción exitosa
            setIsEnrolled(true);
            toast.success('¡Inscripción exitosa!', {
                description: 'Te has inscrito correctamente en el curso'
            });
            
            // Redirigir a página de éxito
            router.push(`/enroll-success?courseId=${courseId}`);

        } catch (error) {
            console.error('Enrollment error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error en la inscripción';
            
            if (errorMessage.includes('already enrolled') || errorMessage.includes('ya inscrito')) {
                setIsEnrolled(true);
                toast.warning('Ya estás inscrito en este curso');
            } else if (errorMessage.includes('Course not found')) {
                toast.error('El curso no está disponible');
            } else if (errorMessage.includes('User not found')) {
                toast.error('Error de usuario. Por favor, vuelve a iniciar sesión');
                router.push('/login');
            } else {
                toast.error(`Error: ${errorMessage}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Mostrar spinner mientras verifica el estado de enrollment
    if (checkingEnrollment || status === 'loading') {
        return (
            <Button disabled variant="ghost" className="text-xs h-7 gap-1">
                <Loader2 className="w-3 animate-spin" />
                Verificando...
            </Button>
        );
    }

    // Si no hay sesión, mostrar botón para login
    if (!userId) {
        return (
            <Button
                onClick={() => router.push('/login')}
                variant="ghost"
                className="text-xs text-blue-700 h-7 gap-1"
            >
                Iniciar sesión
                <ArrowRight className="w-3" />
            </Button>
        );
    }

    // Si ya está inscrito, mostrar estado
    if (isEnrolled) {
        return (
            <Button
                disabled
                variant="ghost"
                className="text-xs text-green-700 h-7 gap-1"
            >
                <CheckCircle className="w-3" />
                Inscrito
            </Button>
        );
    }

    // Botón de inscripción
    return (
        <form action={handleEnrollment}>
            <input type="hidden" name="courseId" value={courseId} />
            <Button
                type="submit"
                variant="ghost"
                className="text-xs text-sky-700 h-7 gap-1 hover:text-sky-900 hover:bg-sky-50"
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-3 animate-spin" />
                        Inscribiendo...
                    </>
                ) : (
                    <>
                        Inscribirse
                        <ArrowRight className="w-3" />
                    </>
                )}
            </Button>
        </form>
    );
};

export default EnrollCourse;

