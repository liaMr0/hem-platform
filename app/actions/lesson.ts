"use server"

import mongoose from "mongoose"; // Agregar esta importación
import { Lesson } from "@/model/lesson.model";
import { Module } from "@/model/module.model";
import { create } from "@/queries/lessons";
import { replaceMongoIdInObject } from "@/lib/convertData";

interface ILesson extends Document {
    title: string;
    description?: string;
    duration: number;
    video_url?: string;
    active: boolean;
    slug: string;
    order: number;
}

export async function createLesson(data: FormData): Promise<any> {
    try {
        const title = data.get("title");
        const slug = data.get("slug");
        const moduleId = data.get("moduleId");
        const order = data.get("order");

        const createdLesson = await create({ title, slug, order });
        
        // Verificar que createdLesson existe y tiene id
        if (!createdLesson || !createdLesson.id) {
            throw new Error('Failed to create lesson - no ID returned');
        }

        const module = await Module.findById(moduleId);
        if (!module) {
            throw new Error('Module not found');
        }

        // Usar el id que viene de replaceMongoIdInObject
        module.lessonIds.push(createdLesson.id);
        await module.save();

        return createdLesson;
    } catch (e) {
        console.error('Error creating lesson:', e);
        throw new Error(`Error creating lesson: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
}

export async function reOrderLesson(data: any) {
    try {
        await Promise.all(data.map(async (element: any) => {
            await Lesson.findByIdAndUpdate(element.id, { order: element.position });
        }));
    } catch (e) {
        console.error('Error reordering lessons:', e);
        throw new Error('Error reordering lessons');
    }
}

export async function updateLesson(lessonId: string, data: any) {
    try {
        const updatedLesson = await Lesson.findByIdAndUpdate(lessonId, data, {
            new: true,
            lean: true
        });

        if (!updatedLesson) {
            throw new Error('Lesson not found');
        }

        return replaceMongoIdInObject(updatedLesson);
    } catch (error) {
        console.error('Error updating lesson:', error);
        throw new Error('No se pudo actualizar la lección');
    }
}

export async function changeLessonPublishState(lessonId: string): Promise<boolean> {
    try {
        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            throw new Error('Lesson not found');
        }
        
        const newActiveState = !lesson.active;
        await updateLesson(lessonId, { active: newActiveState });
        return newActiveState;
    } catch (error) {
        console.error('Error changing lesson publish state:', error);
        throw new Error('No se pudo cambiar el estado de publicación');
    }
}

export async function deleteLesson(lessonId: string, moduleId: string) {
    try {
        // Verificar que los IDs sean válidos
        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            throw new Error('Invalid lesson ID');
        }
        if (!mongoose.Types.ObjectId.isValid(moduleId)) {
            throw new Error('Invalid module ID');
        }

        const module = await Module.findById(moduleId);
        if (!module) {
            throw new Error('Module not found');
        }

        // Eliminar la lección del array del módulo
        module.lessonIds.pull(new mongoose.Types.ObjectId(lessonId));
        
        // Eliminar la lección de la base de datos
        const deletedLesson = await Lesson.findByIdAndDelete(lessonId);
        if (!deletedLesson) {
            throw new Error('Lesson not found');
        }

        // Guardar el módulo (con await)
        await module.save();
        
        return { success: true };
    } catch (err) {
        console.error('Error deleting lesson:', err);
        throw new Error(`Error deleting lesson: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
}