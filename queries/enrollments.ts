import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { Course } from "@/model/course-model";
import { Enrollment } from "@/model/enrollment-model"; 
import { User } from "@/model/user-model";

export async function getEnrollmentsForCourse(courseId){
    const enrollments = await Enrollment.find({course: courseId}).lean();
    return replaceMongoIdInArray(enrollments);
}


export async function getEnrollmentsForUser(userId){
    try {
        const enrollments = await Enrollment.find({ student: userId})
        .populate({
            path: "course",
            model: Course,
        }).lean();
        return replaceMongoIdInArray(enrollments);
    } catch (err) {
        throw new Error(err);
    }

}

export async function hasEnrollmentForCourse(courseId, studentId){
    try {
        const enrollment = await Enrollment.findOne({
            course: courseId,
            student: studentId
        }).populate({
            path: "course",
            model: Course
        }).lean();

        if (!enrollment) return false;
        
        return true;
    } catch (error) {
        throw new Error(error);
    }

}


export async function isUserEnrolled(courseId: string, userId: string): Promise<boolean> {
    try {
        const enrollment = await Enrollment.findOne({
            course: courseId,
            student: userId
        });
        
        return !!enrollment;
    } catch (error) {
        console.error('Error checking enrollment:', error);
        return false;
    }
}

export async function getEnrollmentDetails(courseId: string, userId: string) {
    try {
        const enrollment = await Enrollment.findOne({
            course: courseId,
            student: userId
        }).populate('course').populate('student');
        
        return enrollment;
    } catch (error) {
        console.error('Error getting enrollment details:', error);
        return null;
    }
}

export async function enrollForCourse(courseId: string, userId: string) {
    try {
        // Verificar que el curso existe y está activo
        const course = await Course.findOne({ _id: courseId, active: true });
        if (!course) {
            throw new Error('Course not found or inactive');
        }

        // Verificar que el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Verificar si ya está inscrito
        const existingEnrollment = await Enrollment.findOne({
            course: courseId,
            student: userId
        });

        if (existingEnrollment) {
            throw new Error('User is already enrolled in this course');
        }

        // Crear la inscripción
        const enrollment = new Enrollment({
            course: courseId,
            student: userId,
            enrollment_date: new Date(),
            status: 'not-started',
            progress: 0,
            last_accessed: new Date()
        });

        await enrollment.save();

        return { 
            success: true, 
            message: 'Successfully enrolled in course',
            enrollment: enrollment
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('Enrollment failed');
    }
}

export async function updateEnrollmentProgress(courseId: string, userId: string, progress: number) {
    try {
        const enrollment = await Enrollment.findOneAndUpdate(
            { course: courseId, student: userId },
            { 
                progress: progress,
                last_accessed: new Date(),
                ...(progress >= 100 && { 
                    status: 'completed',
                    completion_date: new Date()
                })
            },
            { new: true }
        );

        return enrollment;
    } catch (error) {
        console.error('Error updating enrollment progress:', error);
        throw new Error('Failed to update progress');
    }
}

export async function getUserEnrollments(userId: string) {
    try {
        const enrollments = await Enrollment.find({ student: userId })
            .populate('course')
            .sort({ enrollment_date: -1 });
        
        return enrollments;
    } catch (error) {
        console.error('Error getting user enrollments:', error);
        return [];
    }
}

export async function getCourseEnrollments(courseId: string) {
    try {
        const enrollments = await Enrollment.find({ course: courseId })
            .populate('student')
            .sort({ enrollment_date: -1 });
        
        return enrollments;
    } catch (error) {
        console.error('Error getting course enrollments:', error);
        return [];
    }
}