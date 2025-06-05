// queries/lessons.ts (Corregido con serialización apropiada)
import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { Lesson } from "@/model/lesson.model";
import mongoose from "mongoose";

export async function getLesson(lessonId: string) {
    try {
        // Validar que lessonId sea un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            console.error('Invalid ObjectId:', lessonId);
            return null;
        }
        
        const lesson = await Lesson.findById(lessonId).lean();
        
        if (!lesson) {
            console.error('Lesson not found:', lessonId);
            return null;
        }
        
        return replaceMongoIdInObject(lesson);
    } catch (error) {
        console.error('Error fetching lesson:', error);
        return null;
    }
}

export async function create(lessonData: any) {
    try {
        const lesson = await Lesson.create(lessonData);
        // Convertir el documento de Mongoose a objeto plano
        const plainLesson = lesson.toObject();
        return replaceMongoIdInObject(plainLesson);
    } catch (error) {
        console.error('Error creating lesson:', error);
        throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
}

export async function getLessonBySlug(slug: string) {
    try {
        const lesson = await Lesson.findOne({ slug: slug }).lean();
        
        if (!lesson) {
            return null;
        }
        
        return replaceMongoIdInObject(lesson);
    } catch (error) {
        console.error('Error fetching lesson by slug:', error);
        return null;
    }
}