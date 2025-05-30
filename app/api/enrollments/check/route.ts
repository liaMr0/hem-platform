// app/api/enrollments/check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { isUserEnrolled } from '@/queries/enrollments';
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

        const isEnrolled = await isUserEnrolled(courseId, userId);

        return NextResponse.json({ isEnrolled });
    } catch (error) {
        console.error('Error checking enrollment:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
