"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; // Asumiendo que usas NextAuth
import { toast } from 'sonner'; // O tu sistema de notificaciones preferido

interface EnrollCourseProps {
    asLink?: boolean;
    courseId: string;
}

const EnrollCourse: React.FC<EnrollCourseProps> = ({ asLink, courseId }) => {
    const router = useRouter();
    const { data: session } = useSession();
    console.log(session);
    
    const [isLoading, setIsLoading] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [checkingEnrollment, setCheckingEnrollment] = useState(true);

    // Verificar si el usuario ya está inscrito al cargar el componente
    useEffect(() => {
        const checkEnrollmentStatus = async () => {
            if (!session?.user?.id) {
                setCheckingEnrollment(false);
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
                        userId: session.user.id
                    })
                });

                const data = await response.json();
                setIsEnrolled(data.isEnrolled);
            } catch (error) {
                console.error('Error checking enrollment:', error);
            } finally {
                setCheckingEnrollment(false);
            }
        };

        checkEnrollmentStatus();
    }, [courseId, session?.user?.id]);

    const handleEnrollment = async (formData: FormData) => {
        // if (!session?.user?.id) {
        //     toast.error('Please login to enroll in courses');
        //     router.push('/login');
        //     return;
        // }

        if (isEnrolled) {
            toast.info('You are already enrolled in this course');
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
                    userId: session?.user?.id
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Enrollment failed');
            }

            if (data.success) {
                setIsEnrolled(true);
                toast.success('Successfully enrolled in course!');
                router.push(`/enroll-success?courseId=${courseId}`);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Enrollment failed';
            
            if (errorMessage.includes('already enrolled')) {
                toast.info('You are already enrolled in this course');
                setIsEnrolled(true);
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Mostrar spinner mientras verifica el estado de enrollment
    if (checkingEnrollment) {
        return (
            <Button disabled variant="ghost" className="text-xs h-7 gap-1">
                <Loader2 className="w-3 animate-spin" />
                Checking...
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
                Enrolled
            </Button>
        );
    }

    return (
        <form action={handleEnrollment}>
            <input type="hidden" name="courseId" value={courseId} />
            <Button
                type="submit"
                variant="ghost"
                className="text-xs text-sky-700 h-7 gap-1"
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-3 animate-spin" />
                        Enrolling...
                    </>
                ) : (
                    <>
                        Enroll
                        <ArrowRight className="w-3" />
                    </>
                )}
            </Button>
        </form>
    );
};

export default EnrollCourse;