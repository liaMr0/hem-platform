
// app/api/enrollments/enroll/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { enrollForCourse } from '@/queries/enrollments';
import { dbConnect } from '@/service/mongo';

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        
        const { courseId, userId } = await request.json();

        if (!courseId || !userId) {
            return NextResponse.json(
                { error: 'Course ID and User ID are required' },
                { status: 400 }
            );
        }

        const result = await enrollForCourse(courseId, userId);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error enrolling user:', error);
        
        const errorMessage = error instanceof Error ? error.message : 'Enrollment failed';
        
        // Manejar diferentes tipos de errores
        if (errorMessage.includes('already enrolled')) {
            return NextResponse.json(
                { error: 'User is already enrolled in this course' },
                { status: 409 } // Conflict
            );
        }

        if (errorMessage.includes('Course not found')) {
            return NextResponse.json(
                { error: 'Course not found or inactive' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

