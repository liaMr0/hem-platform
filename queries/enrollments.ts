// queries/enrollments.ts - Funciones actualizadas con validación mejorada
import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { Course } from "@/model/course-model";
import { Enrollment } from "@/model/enrollment-model"; 
import { User } from "@/model/user-model";
import mongoose from "mongoose";

// Helper function to validate ObjectId
function validateObjectId(id: string, fieldName: string = 'ID'): void {
    if (!id) {
        throw new Error(`${fieldName} is required`);
    }
    
    if (typeof id !== 'string') {
        throw new Error(`${fieldName} must be a string`);
    }
    
    // Check for string representations of undefined/null
    if (id === 'undefined' || id === 'null' || id.trim() === '') {
        throw new Error(`${fieldName} cannot be undefined, null, or empty`);
    }
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ${fieldName} format: ${id}`);
    }
}

export async function getEnrollmentsByCourse(courseId: string) {
    try {
        validateObjectId(courseId, 'Course ID');
        
        const enrollments = await Enrollment.find({ course: courseId })
            .populate({
                path: 'student',
                model: User,
                select: 'firstName lastName email profilePicture'
            })
            .populate({
                path: 'course',
                model: Course,
                select: 'title modules',
                populate: {
                    path: 'modules',
                    select: 'title lessonIds',
                    populate: {
                        path: 'lessonIds',
                        select: 'title'
                    }
                }
            })
            .sort({ enrollment_date: -1 })
            .lean();

        // Enriquecer los datos con información de progreso calculada
        const enrichedEnrollments = await Promise.all(
            enrollments.map(async (enrollment) => {
                // Aquí podrías calcular el progreso real basado en lecciones completadas
                // Por ahora usamos el progreso almacenado en el enrollment
                
                const baseEnrollment = replaceMongoIdInObject(enrollment);
                
                // Calcular progreso basado en módulos y lecciones si es necesario
                const totalLessons = enrollment.course?.modules?.reduce((total, module) => {
                    return total + (module.lessonIds?.length || 0);
                }, 0) || 0;
                
                return {
                    ...baseEnrollment,
                    totalLessons,
                    // Podrías agregar más campos calculados aquí
                };
            })
        );

        return enrichedEnrollments;
    } catch (error) {
        console.error('Error getting enrollments by course:', error);
        throw new Error(`Failed to get course enrollments: ${error.message}`);
    }
}

// Función para obtener estadísticas detalladas de progreso
export async function getCourseEnrollmentStats(courseId: string) {
    try {
        validateObjectId(courseId, 'Course ID');
        
        const enrollments = await Enrollment.find({ course: courseId }).lean();
        
        const stats = {
            total: enrollments.length,
            byStatus: {},
            progressDistribution: {
                '0-25': 0,
                '26-50': 0,
                '51-75': 0,
                '76-99': 0,
                '100': 0
            },
            averageProgress: 0,
            completionRate: 0
        };
        
        if (enrollments.length > 0) {
            // Calcular estadísticas por estado
            enrollments.forEach(enrollment => {
                const status = enrollment.status || 'active';
                stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
                
                // Distribución de progreso
                const progress = enrollment.progress || 0;
                if (progress === 0) stats.progressDistribution['0-25']++;
                else if (progress <= 25) stats.progressDistribution['0-25']++;
                else if (progress <= 50) stats.progressDistribution['26-50']++;
                else if (progress <= 75) stats.progressDistribution['51-75']++;
                else if (progress < 100) stats.progressDistribution['76-99']++;
                else stats.progressDistribution['100']++;
            });
            
            // Progreso promedio
            const totalProgress = enrollments.reduce((sum, enrollment) => 
                sum + (enrollment.progress || 0), 0);
            stats.averageProgress = Math.round(totalProgress / enrollments.length);
            
            // Tasa de finalización
            const completedCount = enrollments.filter(enrollment => 
                enrollment.status === 'completed' || enrollment.progress === 100).length;
            stats.completionRate = Math.round((completedCount / enrollments.length) * 100);
        }
        
        return stats;
    } catch (error) {
        console.error('Error getting course enrollment stats:', error);
        return null;
    }
}


export async function hasEnrollmentForCourse(courseId: string, studentId: string): Promise<boolean> {
    try {
        validateObjectId(courseId, 'Course ID');
        validateObjectId(studentId, 'Student ID');
        
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
        validateObjectId(courseId, 'Course ID');
        validateObjectId(userId, 'User ID');
        
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
        validateObjectId(courseId, 'Course ID');
        validateObjectId(userId, 'User ID');
        
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
        validateObjectId(courseId, 'Course ID');
        validateObjectId(userId, 'User ID');
        
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
        validateObjectId(courseId, 'Course ID');
        validateObjectId(userId, 'User ID');
        
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
        throw new Error(`Failed to update progress: ${error.message}`);
    }
}

export async function getUserEnrollments(userId: string) {
    try {
        validateObjectId(userId, 'User ID');
        
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
        validateObjectId(courseId, 'Course ID');
        
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
        throw new Error(`Failed to get course enrollments: ${error.message}`);
    }
}

// Función adicional para pausar/reanudar enrollment
// export async function updateEnrollmentStatus(courseId: string, userId: string, status: 'not-started' | 'in-progress' | 'completed' | 'paused') {
//     try {
//         validateObjectId(courseId, 'Course ID');
//         validateObjectId(userId, 'User ID');
        
//         const updateData: any = {
//             status: status,
//             last_accessed: new Date()
//         };

//         // Si se completa, agregar fecha de completación
//         if (status === 'completed') {
//             updateData.completion_date = new Date();
//             updateData.progress = 100;
//         }

//         const enrollment = await Enrollment.findOneAndUpdate(
//             { course: courseId, student: userId },
//             updateData,
//             { new: true, runValidators: true }
//         ).lean();

//         return enrollment ? replaceMongoIdInObject(enrollment) : null;
//     } catch (error) {
//         console.error('Error updating enrollment status:', error);
//         throw new Error(`Failed to update enrollment status: ${error.message}`);
//     }
// }

// Función para obtener estadísticas de enrollment
export async function getEnrollmentStats(courseId: string) {
    try {
        validateObjectId(courseId, 'Course ID');
        
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

export async function getEnrollmentsForUser(userId: string) {
    try {
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            console.error('Invalid user ID:', userId);
            return [];
        }

        const enrollments = await Enrollment.find({ 
            student: userId 
        })
        .populate({
            path: 'course',
            model: Course,
            select: 'title subtitle thumbnail instructor modules active',
            populate: {
                path: 'instructor',
                model: User,
                select: 'firstName lastName'
            }
        })
        .populate({
            path: 'student',
            model: User,
            select: 'firstName lastName email'
        })
        .sort({ enrollment_date: -1 })
        .lean();

        return replaceMongoIdInArray(enrollments);
    } catch (error) {
        console.error('Error in getEnrollmentsForUser:', error);
        return [];
    }
}

// Obtener todos los enrollments de un curso específico
export async function getEnrollmentsForCourse(courseId: string) {
    try {
        if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
            console.error('Invalid course ID:', courseId);
            return [];
        }

        const enrollments = await Enrollment.find({ 
            course: courseId 
        })
        .populate({
            path: 'student',
            model: User,
            select: 'firstName lastName email profilePicture'
        })
        .populate({
            path: 'course',
            model: Course,
            select: 'title'
        })
        .sort({ enrollment_date: -1 })
        .lean();

        return replaceMongoIdInArray(enrollments);
    } catch (error) {
        console.error('Error in getEnrollmentsForCourse:', error);
        return [];
    }
}

// Verificar si un usuario está inscrito en un curso específico
export async function isUserEnrolledInCourse(userId: string, courseId: string) {
    try {
        if (!userId || !courseId || 
            !mongoose.Types.ObjectId.isValid(userId) || 
            !mongoose.Types.ObjectId.isValid(courseId)) {
            return false;
        }

        const enrollment = await Enrollment.findOne({
            student: userId,
            course: courseId
        }).lean();

        return !!enrollment;
    } catch (error) {
        console.error('Error checking enrollment:', error);
        return false;
    }
}

// Crear un nuevo enrollment
export async function createEnrollment(studentId: string, courseId: string) {
    try {
        if (!studentId || !courseId || 
            !mongoose.Types.ObjectId.isValid(studentId) || 
            !mongoose.Types.ObjectId.isValid(courseId)) {
            throw new Error('Invalid student or course ID');
        }

        // Verificar si ya está inscrito
        const existingEnrollment = await isUserEnrolledInCourse(studentId, courseId);
        if (existingEnrollment) {
            throw new Error('User is already enrolled in this course');
        }

        // Verificar que el curso existe y está activo
        const course = await Course.findById(courseId).lean();
        if (!course) {
            throw new Error('Course not found');
        }
        if (!course.active) {
            throw new Error('Course is not active');
        }

        const newEnrollment = await Enrollment.create({
            student: studentId,
            course: courseId,
            enrollment_date: new Date(),
            status: 'active'
        });

        return replaceMongoIdInObject(newEnrollment.toObject());
    } catch (error) {
        console.error('Error creating enrollment:', error);
        throw error;
    }
}

// Obtener estadísticas de enrollments por instructor
export async function getEnrollmentStatsByInstructor(instructorId: string) {
    try {
        if (!instructorId || !mongoose.Types.ObjectId.isValid(instructorId)) {
            return {
                totalEnrollments: 0,
                activeEnrollments: 0,
                completedEnrollments: 0,
                courseEnrollments: []
            };
        }

        // Obtener cursos del instructor
        const instructorCourses = await Course.find({ 
            instructor: instructorId,
            active: true 
        }).select('_id title').lean();

        const courseIds = instructorCourses.map(course => course._id);

        if (courseIds.length === 0) {
            return {
                totalEnrollments: 0,
                activeEnrollments: 0,
                completedEnrollments: 0,
                courseEnrollments: []
            };
        }

        // Obtener todos los enrollments de estos cursos
        const enrollments = await Enrollment.find({
            course: { $in: courseIds }
        })
        .populate({
            path: 'course',
            model: Course,
            select: 'title'
        })
        .populate({
            path: 'student',
            model: User,
            select: 'firstName lastName'
        })
        .lean();

        // Calcular estadísticas
        const totalEnrollments = enrollments.length;
        const activeEnrollments = enrollments.filter(e => e.status === 'active').length;
        const completedEnrollments = enrollments.filter(e => e.completion_date).length;

        // Agrupar por curso
        const courseEnrollmentMap = enrollments.reduce((acc, enrollment) => {
            const courseId = enrollment.course._id.toString();
            const courseTitle = enrollment.course.title;
            
            if (!acc[courseId]) {
                acc[courseId] = {
                    courseId,
                    courseTitle,
                    enrollments: []
                };
            }
            
            acc[courseId].enrollments.push(enrollment);
            return acc;
        }, {} as Record<string, any>);

        const courseEnrollments = Object.values(courseEnrollmentMap);

        return {
            totalEnrollments,
            activeEnrollments,
            completedEnrollments,
            courseEnrollments: replaceMongoIdInArray(courseEnrollments)
        };
    } catch (error) {
        console.error('Error in getEnrollmentStatsByInstructor:', error);
        return {
            totalEnrollments: 0,
            activeEnrollments: 0,
            completedEnrollments: 0,
            courseEnrollments: []
        };
    }
}

// Actualizar estado de enrollment
export async function updateEnrollmentStatus(enrollmentId: string, status: string, completionDate?: Date) {
    try {
        if (!enrollmentId || !mongoose.Types.ObjectId.isValid(enrollmentId)) {
            throw new Error('Invalid enrollment ID');
        }

        const updateData: any = { status };
        if (completionDate) {
            updateData.completion_date = completionDate;
        }

        const updatedEnrollment = await Enrollment.findByIdAndUpdate(
            enrollmentId,
            updateData,
            { new: true }
        ).lean();

        return replaceMongoIdInObject(updatedEnrollment);
    } catch (error) {
        console.error('Error updating enrollment status:', error);
        throw error;
    }
}

// Obtener enrollments con paginación
export async function getEnrollmentsWithPagination(
    page = 1, 
    limit = 10, 
    filters: {
        studentId?: string;
        courseId?: string;
        instructorId?: string;
        status?: string;
    } = {}
) {
    try {
        const skip = (page - 1) * limit;
        let query: any = {};

        // Aplicar filtros
        if (filters.studentId && mongoose.Types.ObjectId.isValid(filters.studentId)) {
            query.student = filters.studentId;
        }
        
        if (filters.courseId && mongoose.Types.ObjectId.isValid(filters.courseId)) {
            query.course = filters.courseId;
        }
        
        if (filters.status) {
            query.status = filters.status;
        }

        // Si se filtra por instructor, primero obtener sus cursos
        if (filters.instructorId && mongoose.Types.ObjectId.isValid(filters.instructorId)) {
            const instructorCourses = await Course.find({ 
                instructor: filters.instructorId 
            }).select('_id').lean();
            
            const courseIds = instructorCourses.map(course => course._id);
            query.course = { $in: courseIds };
        }

        const [enrollments, total] = await Promise.all([
            Enrollment.find(query)
                .populate({
                    path: 'student',
                    model: User,
                    select: 'firstName lastName email'
                })
                .populate({
                    path: 'course',
                    model: Course,
                    select: 'title instructor',
                    populate: {
                        path: 'instructor',
                        model: User,
                        select: 'firstName lastName'
                    }
                })
                .sort({ enrollment_date: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            
            Enrollment.countDocuments(query)
        ]);

        return {
            enrollments: replaceMongoIdInArray(enrollments),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        };
    } catch (error) {
        console.error('Error in getEnrollmentsWithPagination:', error);
        return {
            enrollments: [],
            pagination: {
                page: 1,
                limit,
                total: 0,
                pages: 0,
                hasNext: false,
                hasPrev: false
            }
        };
    }
}