// queries/enrollments.ts - Funciones actualizadas para tu modelo
import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { Course } from "@/model/course-model";
import { Enrollment } from "@/model/enrollment-model"; 
import { User } from "@/model/user-model";
import mongoose from "mongoose";

export async function getEnrollmentsForCourse(courseId: string) {
    const enrollments = await Enrollment.find({course: courseId}).lean();
    return replaceMongoIdInArray(enrollments);
}

export async function getEnrollmentsForUser(userId: string) {
    try {
        const enrollments = await Enrollment.find({ student: userId})
            .populate({
                path: "course",
                model: Course,
                select: "_id title thumbnail category modules active" // Solo campos necesarios
            })
            .lean();
        
        // Filtrar enrollments con cursos válidos
        const validEnrollments = enrollments.filter(enrollment => 
            enrollment.course && 
            enrollment.course._id && 
            enrollment.course.active !== false // Incluir cursos activos
        );
        
        return replaceMongoIdInArray(validEnrollments);
    } catch (err) {
        console.error('Error fetching user enrollments:', err);
        throw new Error(`Failed to fetch enrollments: ${err.message}`);
    }
}

export async function hasEnrollmentForCourse(courseId: string, studentId: string): Promise<boolean> {
    try {
        const enrollment = await Enrollment.findOne({
            course: courseId,
            student: studentId
        }).lean();

        return !!enrollment;
    } catch (error) {
        console.error('Error checking enrollment:', error);
        return false;
    }
}

export async function isUserEnrolled(courseId: string, userId: string): Promise<boolean> {
    try {
        const enrollment = await Enrollment.findOne({
            course: courseId,
            student: userId
        }).lean();
        
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
        })
        .populate('course')
        .populate('student')
        .lean();
        
        return enrollment ? replaceMongoIdInObject(enrollment) : null;
    } catch (error) {
        console.error('Error getting enrollment details:', error);
        return null;
    }
}

export async function enrollForCourse(courseId: string, userId: string) {
    try {
        // Verificar que el curso existe y está activo
        const course = await Course.findOne({ _id: courseId, active: true }).lean();
        if (!course) {
            throw new Error('Course not found or inactive');
        }

        // Verificar que el usuario existe
        const user = await User.findById(userId).lean();
        if (!user) {
            throw new Error('User not found');
        }

        // Verificar si ya está inscrito (verificación previa)
        const existingEnrollment = await Enrollment.findOne({
            course: courseId,
            student: userId
        }).lean();

        if (existingEnrollment) {
            return { 
                success: false, 
                message: 'User is already enrolled in this course',
                enrollment: replaceMongoIdInObject(existingEnrollment),
                alreadyEnrolled: true,
                error: 'ALREADY_ENROLLED'
            };
        }

        // Crear la inscripción - tu middleware manejará los duplicados
        const enrollmentData = {
            course: courseId,
            student: userId,
            enrollment_date: new Date(),
            status: 'not-started',
            progress: 0,
            last_accessed: new Date()
        };

        const enrollment = new Enrollment(enrollmentData);
        const savedEnrollment = await enrollment.save();

        return { 
            success: true, 
            message: 'Successfully enrolled in course',
            enrollment: replaceMongoIdInObject(savedEnrollment.toObject()),
            alreadyEnrolled: false
        };

    } catch (error) {
        console.error('Enrollment error:', error);
        
        // Tu middleware convierte el error 11000 en un mensaje más claro
        if (error.message.includes('already enrolled')) {
            return {
                success: false,
                message: 'User is already enrolled in this course',
                error: 'ALREADY_ENROLLED',
                alreadyEnrolled: true
            };
        }
        
        // Otros errores de validación de Mongoose
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
        }
        
        throw new Error(error.message || 'Enrollment failed');
    }
}

export async function updateEnrollmentProgress(courseId: string, userId: string, progress: number) {
    try {
        if (progress < 0 || progress > 100) {
            throw new Error('Progress must be between 0 and 100');
        }

        const updateData: any = {
            progress: progress,
            last_accessed: new Date()
        };

        // Si el progreso es 100%, marcar como completado
        if (progress >= 100) {
            updateData.status = 'completed';
            updateData.completion_date = new Date();
        } else if (progress > 0) {
            updateData.status = 'in-progress';
        }

        const enrollment = await Enrollment.findOneAndUpdate(
            { course: courseId, student: userId },
            updateData,
            { new: true, runValidators: true }
        ).lean();

        return enrollment ? replaceMongoIdInObject(enrollment) : null;
    } catch (error) {
        console.error('Error updating enrollment progress:', error);
        throw new Error('Failed to update progress');
    }
}

export async function getUserEnrollments(userId: string) {
    try {
        const enrollments = await Enrollment.find({ student: userId })
            .populate({
                path: 'course',
                select: 'title thumbnail category active'
            })
            .sort({ enrollment_date: -1 })
            .lean();
        
        // Filtrar enrollments con cursos válidos
        const validEnrollments = enrollments.filter(enrollment => 
            enrollment.course && enrollment.course._id
        );
        
        return replaceMongoIdInArray(validEnrollments);
    } catch (error) {
        console.error('Error getting user enrollments:', error);
        return [];
    }
}

export async function getCourseEnrollments(courseId: string) {
    try {
        const enrollments = await Enrollment.find({ course: courseId })
            .populate({
                path: 'student',
                select: 'firstName lastName email'
            })
            .sort({ enrollment_date: -1 })
            .lean();
        
        return replaceMongoIdInArray(enrollments);
    } catch (error) {
        console.error('Error getting course enrollments:', error);
        return [];
    }
}

// Función adicional para pausar/reanudar enrollment
export async function updateEnrollmentStatus(courseId: string, userId: string, status: 'not-started' | 'in-progress' | 'completed' | 'paused') {
    try {
        const updateData: any = {
            status: status,
            last_accessed: new Date()
        };

        // Si se completa, agregar fecha de completación
        if (status === 'completed') {
            updateData.completion_date = new Date();
            updateData.progress = 100;
        }

        const enrollment = await Enrollment.findOneAndUpdate(
            { course: courseId, student: userId },
            updateData,
            { new: true, runValidators: true }
        ).lean();

        return enrollment ? replaceMongoIdInObject(enrollment) : null;
    } catch (error) {
        console.error('Error updating enrollment status:', error);
        throw new Error('Failed to update enrollment status');
    }
}

// Función para obtener estadísticas de enrollment
export async function getEnrollmentStats(courseId: string) {
    try {
        const stats = await Enrollment.aggregate([
            { $match: { course: new mongoose.Types.ObjectId(courseId) } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    avgProgress: { $avg: '$progress' }
                }
            }
        ]);

        const total = await Enrollment.countDocuments({ course: courseId });

        return {
            total,
            byStatus: stats.reduce((acc, stat) => {
                acc[stat._id] = {
                    count: stat.count,
                    avgProgress: Math.round(stat.avgProgress || 0)
                };
                return acc;
            }, {})
        };
    } catch (error) {
        console.error('Error getting enrollment stats:', error);
        return { total: 0, byStatus: {} };
    }
}