"use server"
 
import { Lesson } from "@/model/lesson.model";
import { Module } from "@/model/module.model"; 
import { create } from "@/queries/lessons";
import mongoose from "mongoose";

interface ILesson extends Document {
    title: string;
    description?: string;
    duration: number;
    video_url?: string;
    active: boolean;
    slug: string;
    order: number;
  }

export async function createLesson(data: FormData): Promise<ILesson>{
    try {
        const title = data.get("title");
        const slug = data.get("slug");
        const moduleId = data.get("moduleId");
        const order = data.get("order");

        const createdLesson = await create({title,slug,order});

        const module = await Module.findById(moduleId);
        module.lessonIds.push(createdLesson._id);
        module.save();

        return createdLesson;
        
    } catch (e) {
        throw new Error('Error creating lesson');
    }
}

export async function reOrderLesson(data:any){

    try {
        await Promise.all(data.map(async(element:any) => {
            await Lesson.findByIdAndUpdate(element.id, {order: element.position});
        }));
    } catch (e) {
        throw new Error('Error reordering lessons');
    }

}

export async function updateLesson(lessonId: string, data: any) {
    try {
        await Lesson.findByIdAndUpdate(lessonId,data);
    } catch (error) {
        console.error('Error changing lesson publish state:', error);
        throw new Error('No se pudo cambiar el estado de publicación');
    }
}


export async function changeLessonPublishState(lessonId: string): Promise<boolean> {
  try {
    const lesson = await Lesson.findById(lessonId);
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
        const module = await Module.findById(moduleId);
        module.lessonIds.pull(new mongoose.Types.ObjectId(lessonId));
        await Lesson.findByIdAndDelete(lessonId);
        module.save();
    } catch (err) {
        throw new Error('Error deleting lesson');
    }
}



 
