// actions/courses.ts
"use server"

import { getLoggedInUser } from "@/lib/loggedin-user"
import { Course } from "@/model/course-model";
import { Lesson } from "@/model/lesson.model";
import { Enrollment } from "@/model/enrollment-model";
import { Module } from "@/model/module.model";
import { create } from "@/queries/courses";
import mongoose, { Types } from "mongoose";
import { Watch } from "@/model/watch-model";
import { Testimonial } from "@/model/testimonial-model";
import { Assessment } from "@/model/assessment-model";
import { Report } from "@/model/report-model";

interface Testimonial {
  _id: Types.ObjectId;
}

interface CourseData {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  subtitle?: string;
  thumbnail: string;
  modules: Types.ObjectId[];
  active: boolean;
  category: Types.ObjectId;
  instructor?: Types.ObjectId;
  testimonials?: Types.ObjectId[];
  quizSet?: Types.ObjectId;
  learning?: string[];
  createdOn?: Date;
  modifiedOn?: Date;
  __v?: number;
}

interface QuizSetUpdate {
  quizSetId: string;
}

// Helper function to check if user can modify course
async function canModifyCourse(courseId: string): Promise<boolean> {
  const loggedInUser = await getLoggedInUser();
  
  if (!loggedInUser) {
    throw new Error("Usuario no autenticado");
  }

  if (loggedInUser.role === 'admin') {
    return true;
  }

  // Instructor solo puede modificar sus propios cursos
  if (loggedInUser.role === 'instructor') {
    const course = await Course.findById(courseId).lean();
    if (!course) {
      throw new Error("Curso no encontrado");
    }
    
    return course.instructor.toString() === loggedInUser.id;
  }

  return false;
}

export async function createCourse(data: Partial<CourseData>): Promise<CourseData> {
    try {
        const loggedinUser = await getLoggedInUser();
        
        if (!loggedinUser) {
            throw new Error("Usuario no autenticado");
        }

        // Solo admin e instructor pueden crear cursos
        if (!['admin', 'instructor'].includes(loggedinUser.role)) {
            throw new Error("No tienes permisos para crear cursos");
        }

        data["instructor"] = loggedinUser?.id;
        const course = await create(data);
        return course;
    } catch (e) {
        throw new Error(e as string);
    }
}


export async function changeCoursePublishState(courseId: string): Promise<boolean> {
    try {
        const canModify = await canModifyCourse(courseId);
        
        if (!canModify) {
            throw new Error("No tienes permisos para modificar este curso");
        }

        const course = await Course.findById(courseId).lean() as CourseData | null;
        
        if (!course) {
            throw new Error(`Course with ID ${courseId} not found`);
        }
        
        const res = await Course.findByIdAndUpdate(
            courseId, 
            { active: !course.active },
            { lean: true, new: true }
        ).lean() as CourseData | null;
        
        if (!res) {
            throw new Error(`Failed to update course with ID ${courseId}`);
        }
        
        return res.active;
    } catch (error) {
        throw new Error(error as string);
    }
}

export async function deleteCourse(courseId: string): Promise<void> {
    try {
        const canModify = await canModifyCourse(courseId);
        
        if (!canModify) {
            throw new Error("No tienes permisos para eliminar este curso");
        }

        // 1. Obtener el curso con los módulos poblados
        const course = await Course.findById(courseId).populate({
            path: "modules",
            populate: {
                path: "lessonIds",
                model: "Lesson"
            }
        });
        
        if (!course) throw new Error("Curso no encontrado");

        // 2. Obtener IDs de módulos
        const moduleIds = course.modules.map((mod: any) => mod._id);

        // 3. Obtener todos los IDs de lecciones de todos los módulos
        const lessonIds: string[] = [];
        course.modules.forEach((module: any) => {
            if (module.lessonIds && module.lessonIds.length > 0) {
                module.lessonIds.forEach((lesson: any) => {
                    lessonIds.push(lesson._id);
                });
            }
        });

        // 4. Eliminar todo lo relacionado
        await Promise.all([
            // Eliminar lecciones
            Lesson.deleteMany({ _id: { $in: lessonIds } }),
            // Eliminar módulos
            Module.deleteMany({ _id: { $in: moduleIds } }),
            // Eliminar inscripciones
            Enrollment.deleteMany({ course: courseId }),
            // Eliminar reportes
            Report.deleteMany({ course: courseId }),
            // Eliminar registros de visualización
            Watch.deleteMany({ lesson: { $in: lessonIds } }),
            // Eliminar testimonios
            Testimonial.deleteMany({ courseId: courseId }),
            // Eliminar assessment si existe
            course.quizSet ? Assessment.findByIdAndDelete(course.quizSet) : Promise.resolve()
        ]);

        // 5. Eliminar el curso en sí
        await Course.findByIdAndDelete(courseId);

        console.log(`Curso ${courseId} y todas sus dependencias eliminados exitosamente`);

    } catch (err) {
        console.error("Error al eliminar el curso y sus dependencias:", err);
        throw new Error("Error al eliminar el curso y sus dependencias");
    }
}

// En tu archivo de actions/course.js o similar

export async function updateQuizSetForCourse(courseId: string, data: { quizSetId: string }): Promise<void> {
    try {
        const canModify = await canModifyCourse(courseId);
        
        if (!canModify) {
            throw new Error("No tienes permisos para modificar este curso");
        }

        // Validar que el quizSetId existe si no está vacío
        if (data.quizSetId && data.quizSetId.trim() !== "") {
            // Verificar que el QuizSet existe
            const quizSetExists = await Quizset.findById(data.quizSetId).lean();
            if (!quizSetExists) {
                throw new Error("El conjunto de preguntas seleccionado no existe");
            }
        }

        // Preparar los datos para actualizar
        const updateData = {
            quizSet: data.quizSetId && data.quizSetId.trim() !== "" ? data.quizSetId : null,
            modifiedOn: new Date()
        };

        await Course.findByIdAndUpdate(courseId, updateData);
    } catch (e) {
        console.error('Error updating quiz set for course:', e);
        throw new Error(e.message || 'Error al actualizar el conjunto de preguntas');
    }
}

// También actualiza tu función existente updateCourse para manejar mejor los errores
export async function updateCourse(courseId: string, dataToUpdate: any): Promise<void> {
    try {
        const canModify = await canModifyCourse(courseId);
        
        if (!canModify) {
            throw new Error("No tienes permisos para modificar este curso");
        }

        // Agregar timestamp de modificación
        const updateData = {
            ...dataToUpdate,
            modifiedOn: new Date()
        };

        await Course.findByIdAndUpdate(courseId, updateData);
    } catch (e) {
        console.error('Error updating course:', e);
        throw new Error(e.message || 'Error al actualizar el curso');
    }
}