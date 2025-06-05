// queries/courses.ts
import { Course } from "@/model/course-model";
import { Module } from "@/model/module.model";
import { Testimonial } from "@/model/testimonial-model";
import { User } from "@/model/user-model";
import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { getEnrollmentsForCourse } from "./enrollments";
import { getTestimonialsForCourse } from "./testimonials";
import { Lesson } from "@/model/lesson.model";
import mongoose from "mongoose";
import { Enrollment } from "@/model/enrollment-model";


// queries/courses.ts - Función getCourseDetails actualizada
export async function getCourseDetails(courseId: string) {
    try {
        // Validar que courseId existe y es válido
        if (!courseId) {
            console.error('Invalid course ID: undefined or null');
            throw new Error('Course ID is required');
        }

        if (typeof courseId !== 'string') {
            console.error('Invalid course ID type:', typeof courseId, courseId);
            throw new Error('Course ID must be a string');
        }

        // Check for string representations of undefined/null
        if (courseId === 'undefined' || courseId === 'null' || courseId.trim() === '') {
            console.error('Invalid course ID value:', courseId);
            throw new Error('Course ID cannot be undefined, null, or empty');
        }

        // Validar que es un ObjectId válido de MongoDB
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            console.error('Invalid MongoDB ObjectId:', courseId);
            throw new Error('Invalid course ID format');
        }

        const course = await Course.findById(courseId)
            .select([
                "title",
                "subtitle",
                "description",
                "thumbnail",
                "modules",
                "instructor",
                "testimonials",
                "quizSet",
                "active",
                "learning",
                "documents", // Agregar documentos a la selección
                "createdOn",
                "modifiedOn"
            ])
            .populate({
                path: "modules",
                model: Module,
                populate: {
                    path: "lessonIds",
                    model: Lesson
                }
            })
            .populate({
                path: "instructor",
                model: User
            })
            .populate({
                path: "testimonials",
                model: Testimonial,
                populate: {
                    path: "user",
                    model: User
                }
            })
            .lean();

        if (!course) {
            console.error('Course not found with ID:', courseId);
            return null;
        }

        return replaceMongoIdInObject(course);
    } catch (error) {
        console.error('Error in getCourseDetails:', error);
        throw new Error(`Failed to get course details: ${error.message}`);
    }
}

// También actualizar getDashboardCourses para incluir conteo de documentos
export async function getDashboardCourses(instructorId?: string) {
    try {
        let query = {};
        
        // Si se proporciona instructorId, filtrar solo cursos de ese instructor
        if (instructorId) {
            if (!mongoose.Types.ObjectId.isValid(instructorId)) {
                throw new Error('Invalid instructor ID format');
            }
            query = { instructor: instructorId };
        }

        const courses = await Course.find(query)
            .select([
                "title",
                "subtitle", 
                "thumbnail",
                "modules",
                "category",
                "instructor",
                "active",
                "price",
                "documents", // Incluir documentos para mostrar conteo
                "createdOn",
                "modifiedOn"
            ])
            .populate({
                path: "instructor",
                model: User,
                select: "_id firstName lastName designation profilePicture"
            })
            .populate({
                path: "category",
                select: "title"
            })
            .populate({
                path: "modules",
                model: Module,
                select: "title"
            })
            .sort({ createdOn: -1 })
            .lean();

        return replaceMongoIdInArray(courses);
    } catch (error) {
        console.error('Error in getDashboardCourses:', error);
        throw new Error(`Failed to get dashboard courses: ${error.message}`);
    }
}

export function groupBy(array: any[], keyFn: (item: any) => string) {
    return array.reduce((acc, item) => {
        const key = keyFn(item);
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);
        return acc;
    }, {} as Record<string, any[]>);
}

export async function getCourseDetailsByInstructor(instructorId: string, expand?: boolean) {
  try {
    const courses = await Course.find({ instructor: instructorId }).lean();
    
    if (!expand) {
      return { courses, enrollments: [], reviews: [] };
    }

    const courseIds = courses.map(course => course._id);
    
    // Obtener enrollments con información del estudiante poblada
    const enrollments = await Enrollment.find({ 
      course: { $in: courseIds } 
    })
    .populate({
      path: 'student',
      model: User,
      select: 'firstName lastName email'
    })
    .populate({
      path: 'course',
      model: Course,
      select: 'title'
    })
    .lean();

    const reviews = await Testimonial.find({ 
      courseId: { $in: courseIds } 
    })
    .populate({
      path: 'user',
      model: User,
      select: 'firstName lastName'
    })
    .lean();

    return {
      courses,
      enrollments,
      reviews
    };
  } catch (error) {
    console.error('Error in getCourseDetailsByInstructor:', error);
    throw error;
  }
}

export async function create(courseData: any) {
    try {
        const course = await Course.create(courseData);
        return JSON.parse(JSON.stringify(course));
    } catch (error) {
        console.error("Error creating course:", error);
        throw new Error(`Error creating course: ${error}`);
    }
}

export async function getRelatedCourses(currentCourseId: string, categoryId: string) {
    try {
        // Validar que los IDs sean válidos
        if (!mongoose.Types.ObjectId.isValid(currentCourseId) || 
            !mongoose.Types.ObjectId.isValid(categoryId)) {
            console.error("Invalid IDs provided:", { currentCourseId, categoryId });
            return [];
        }

        const currentCourseObjectId = new mongoose.Types.ObjectId(currentCourseId);
        const categoryObjectId = new mongoose.Types.ObjectId(categoryId);
        
        const relatedCourses = await Course.find({
            category: categoryObjectId,
            _id: { $ne: currentCourseObjectId },
            active: true,
        })
        .select("title thumbnail price")
        .lean();
        
        return relatedCourses || [];
    } catch (error) {
        console.error("Error getting related courses:", error);
        return [];
    }
}

export async function getCourseList() {
    try {
        const courses = await Course.find({ active: true })
            .select([
                "title",
                "subtitle", 
                "description",
                "thumbnail",
                "modules",
                "instructor",
                "createdOn"
            ])
            .populate({
                path: "instructor",
                model: User,
                select: "_id firstName lastName designation profilePicture"
            })
            .populate({
                path: "testimonials",
                model: Testimonial,
                select: "rating comment user",
                populate: {
                    path: "user",
                    model: User,
                    select: "firstName lastName"
                }
            })
            .populate({
                path: "modules",
                model: Module,
                select: "title lessonIds",
                populate: {
                    path: "lessonIds",
                    model: Lesson,
                    select: "title duration"
                }
            })
            .sort({ createdOn: -1 })
            .lean();
        
        return replaceMongoIdInArray(courses);
    } catch (error) {
        console.error('Error in getCourseList:', error);
        throw new Error(`Failed to get course list: ${error.message}`);
    }
}


// Función para buscar cursos con filtros avanzados
export async function searchCourses(searchParams: {
    search?: string;
    instructor?: string;
    sortBy?: 'newest' | 'oldest' | 'title';
}) {
    try {
        let query: any = { active: true };
        
        // Filtro de búsqueda por texto
        if (searchParams.search) {
            query.$or = [
                { title: { $regex: searchParams.search, $options: 'i' } },
                { subtitle: { $regex: searchParams.search, $options: 'i' } },
                { description: { $regex: searchParams.search, $options: 'i' } }
            ];
        }
        
        // Filtro por instructor
        if (searchParams.instructor) {
            if (mongoose.Types.ObjectId.isValid(searchParams.instructor)) {
                query.instructor = searchParams.instructor;
            }
        }
        
        // Configurar ordenamiento
        let sortOption: any = { createdOn: -1 }; // Por defecto más nuevos
        
        switch (searchParams.sortBy) {
            case 'oldest':
                sortOption = { createdOn: 1 };
                break;
            case 'title':
                sortOption = { title: 1 };
                break;
            case 'newest':
            default:
                sortOption = { createdOn: -1 };
                break;
        }
        
        const courses = await Course.find(query)
            .select([
                "title",
                "subtitle",
                "description",
                "thumbnail", 
                "modules",
                "instructor",
                "createdOn"
            ])
            .populate({
                path: "instructor",
                model: User,
                select: "_id firstName lastName designation profilePicture"
            })
            .populate({
                path: "testimonials",
                model: Testimonial,
                select: "rating comment user",
                populate: {
                    path: "user",
                    model: User,
                    select: "firstName lastName"
                }
            })
            .populate({
                path: "modules",
                model: Module,
                select: "title lessonIds",
                populate: {
                    path: "lessonIds",
                    model: Lesson,
                    select: "title duration"
                }
            })
            .sort(sortOption)
            .lean();
            
        return replaceMongoIdInArray(courses);
    } catch (error) {
        console.error('Error in searchCourses:', error);
        throw new Error(`Failed to search courses: ${error.message}`);
    }
}


// Función para obtener estadísticas de progreso de un curso
export async function getCourseProgressStats(courseId: string, studentId: string) {
    try {
        if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(studentId)) {
            throw new Error('Invalid course or student ID');
        }

        const course = await getCourseDetails(courseId);
        if (!course) {
            return null;
        }

        // Obtener reporte del estudiante
        const { getReport } = await import('./reports');
        const report = await getReport({ course: courseId, student: studentId });
        
        if (!report) {
            return {
                totalModules: course.modules?.length || 0,
                completedModules: 0,
                totalLessons: 0,
                completedLessons: 0,
                progress: 0,
                isCompleted: false,
                completionDate: null
            };
        }

        const totalModules = course.modules?.length || 0;
        const completedModules = report.totalCompletedModeules?.length || 0;
        
        // Calcular total de lecciones
        const totalLessons = course.modules?.reduce((acc, module) => {
            return acc + (module.lessonIds?.length || 0);
        }, 0) || 0;
        
        const completedLessons = report.totalCompletedLessons?.length || 0;
        const progress = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
        
        return {
            totalModules,
            completedModules,
            totalLessons,
            completedLessons,
            progress: Math.round(progress),
            isCompleted: progress === 100 || !!report.completion_date,
            completionDate: report.completion_date
        };
        
    } catch (error) {
        console.error('Error getting course progress stats:', error);
        return null;
    }
}