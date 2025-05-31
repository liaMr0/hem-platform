
import { NextRequest, NextResponse } from 'next/server';
import { enrollForCourse } from '@/queries/enrollments';
import { dbConnect } from '@/service/mongo';

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        
        const { courseId, userId } = await request.json();

        if (!courseId || !userId) {
            return NextResponse.json(
                { 
                    success: false,
                    error: 'Course ID and User ID are required' 
                },
                { status: 400 }
            );
        }

        const result = await enrollForCourse(courseId, userId);

        // Manejar caso de inscripción duplicada
        if (!result.success && result.alreadyEnrolled) {
            return NextResponse.json(
                { 
                    success: false,
                    error: 'Ya estás inscrito en este curso',
                    code: 'ALREADY_ENROLLED',
                    enrollment: result.enrollment
                },
                { status: 409 } // Conflict
            );
        }

        // Respuesta exitosa
        if (result.success) {
            return NextResponse.json({
                success: true,
                message: 'Inscripción exitosa',
                enrollment: result.enrollment
            }, { status: 201 });
        }

        // Otros errores
        return NextResponse.json(
            { 
                success: false,
                error: result.message || 'Error en la inscripción'
            },
            { status: 400 }
        );

    } catch (error) {
        console.error('Error enrolling user:', error);
        
        const errorMessage = error instanceof Error ? error.message : 'Enrollment failed';
        
        // Manejar errores específicos
        if (errorMessage.includes('already enrolled')) {
            return NextResponse.json(
                { 
                    success: false,
                    error: 'Ya estás inscrito en este curso',
                    code: 'ALREADY_ENROLLED'
                },
                { status: 409 }
            );
        }

        if (errorMessage.includes('Course not found')) {
            return NextResponse.json(
                { 
                    success: false,
                    error: 'Curso no encontrado o inactivo' 
                },
                { status: 404 }
            );
        }

        if (errorMessage.includes('User not found')) {
            return NextResponse.json(
                { 
                    success: false,
                    error: 'Usuario no encontrado' 
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { 
                success: false,
                error: 'Error interno del servidor' 
            },
            { status: 500 }
        );
    }
}