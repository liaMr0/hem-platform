import { Course } from "@/model/course-model";
import { Module } from "@/model/module.model";
import { Testimonial } from "@/model/testimonial-model";
import { User } from "@/model/user-model";
import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { getEnrollmentsForCourse } from "./enrollments";
import { getTestimonialsForCourse } from "./testimonials";
import { Lesson } from "@/model/lesson.model";
import { Quizset } from "@/model/quizset-model";
import { Quiz } from "@/model/quizzes-model";
import mongoose from "mongoose";

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

export async function getCourseDetails(id: any) {
    try {
        // Validar que el ID sea válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error("Invalid course ID:", id);
            return null;
        }

        const course = await Course.findById(id)
            .populate({
                path: "instructor",
                model: User,
                select: "_id firstName lastName designation profilePicture bio"
            })
            .populate({
                path: "modules",
                model: Module,
                populate: {
                    path: "lessonIds",
                    model: Lesson
                }
            })
            .populate({
                path: "testimonials",
                model: Testimonial,
                populate: {
                    path: "user",
                    model: User,
                    select: "firstName lastName profilePicture"
                }
            })
            .populate({
                path: "quizSet",
                model: Quizset,
                populate: {
                    path: "quizIds",
                    model: Quiz
                }
            })
            .lean();
        
        if (!course) {
            console.error("Course not found with ID:", id);
            return null;
        }

        // Verificar que el instructor esté poblado correctamente
        if (!course.instructor || !course.instructor._id) {
            console.error("Instructor data missing or incomplete for course:", id);
            // Intentar obtener el instructor por separado si no se pobló correctamente
            if (course.instructor && typeof course.instructor === 'string') {
                try {
                    const instructorData = await User.findById(course.instructor)
                        .select("_id firstName lastName designation profilePicture bio")
                        .lean();
                    if (instructorData) {
                        course.instructor = instructorData;
                    }
                } catch (error) {
                    console.error("Error fetching instructor separately:", error);
                }
            }
        }
        
        return replaceMongoIdInObject(course);
    } catch (error) {
        console.error("Error in getCourseDetails:", error);
        return null;
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
        // Validar que el instructorId sea válido
        if (!mongoose.Types.ObjectId.isValid(instructorId)) {
            console.error("Invalid instructor ID:", instructorId);
            return null;
        }

        const publishCourses = await Course.find({instructor: instructorId, active: true})
            .populate({
                path: "testimonials", 
                model: Testimonial
            })
            .populate({ 
                path: "instructor", 
                model: User,
                select: "_id firstName lastName designation profilePicture bio"
            })
            .lean();

        const enrollments = await Promise.all(
            publishCourses.map(async (course) => {
                const enrollment = await getEnrollmentsForCourse(course._id.toString());
                return enrollment;
            })
        );

        // Group enrollments by course
        const groupByCourses = groupBy(enrollments.flat(), (item) => item.course);

        // Calculate total revenue 
        const totalRevenue = publishCourses.reduce((acc, course) => {
            const enrollmentsForCourse = groupByCourses[course._id.toString()] || [];
            return acc + enrollmentsForCourse.length * (course.price || 0); 
        }, 0);

        const totalEnrollments = enrollments.reduce((acc, obj) => {
            return acc + obj.length;
        }, 0);
        
        const testimonials = await Promise.all(
            publishCourses.map(async (course) => {
                const testimonial = await getTestimonialsForCourse(course._id.toString());
                return testimonial;
            })
        );

        const totalTestimonials = testimonials.flat();
        const avgRating = totalTestimonials.length > 0 
            ? (totalTestimonials.reduce((acc, obj) => acc + (obj.rating || 0), 0)) / totalTestimonials.length
            : 0;

        const instructorInfo = publishCourses.length > 0 && publishCourses[0]?.instructor 
            ? publishCourses[0].instructor 
            : null;

        const firstName = instructorInfo?.firstName || "Unknown";
        const lastName = instructorInfo?.lastName || "Unknown";
        const fullInsName = `${firstName} ${lastName}`;
        const Designation = instructorInfo?.designation || "Unknown";
        const insImage = instructorInfo?.profilePicture || "/default-avatar.png";

        if (expand) {
            const allCourses = await Course.find({instructor: instructorId}).lean();
            return {
                "courses": allCourses?.flat() || [],
                "enrollments": enrollments?.flat() || [],
                "reviews": totalTestimonials,
            };
        }

        return {
            "courses": publishCourses.length,
            "enrollments": totalEnrollments,
            "reviews": totalTestimonials.length,
            "ratings": avgRating > 0 ? Number(avgRating.toPrecision(2)) : 0,
            "inscourses": publishCourses,
            "revenue": totalRevenue,
            fullInsName,
            Designation,
            insImage
        };
    } catch (error) {
        console.error("Error in getCourseDetailsByInstructor:", error);
        return null;
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