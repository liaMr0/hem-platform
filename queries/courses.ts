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

export async function getCourseList() {
    const courses = await Course.find({active:true})
        .select(["title","subtitle","thumbnail","modules","price","category","instructor"])
        .populate({
            path: "instructor",
            model: User,
            select: "_id firstName lastName designation profilePicture"
        })
        .populate({
            path: "testimonials",
            model: Testimonial
        })
        .populate({
            path: "modules",
            model: Module
        })
        .lean();
    return replaceMongoIdInArray(courses);
}  


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

        // Validar que es un ObjectId válido de MongoDB
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            console.error('Invalid MongoDB ObjectId:', courseId);
            throw new Error('Invalid course ID format');
        }

        const course = await Course.findById(courseId)
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


function groupBy(array: any[], keyFn: (item: any) => string) {
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
      select: 'firstName lastName email' // Seleccionar solo los campos necesarios
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