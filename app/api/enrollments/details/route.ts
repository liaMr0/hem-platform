// app/api/enrollments/details/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getEnrollmentDetails } from '@/queries/enrollments';
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

        const enrollment = await getEnrollmentDetails(courseId, userId);

        if (!enrollment) {
            return NextResponse.json(
                { error: 'Enrollment not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ enrollment });
    } catch (error) {
        console.error('Error getting enrollment details:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}