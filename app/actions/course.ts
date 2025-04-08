"use server"

import { getLoggedInUser } from "@/lib/loggedin-user"
import { Course } from "@/model/course-model";
import { create } from "@/queries/courses";
import mongoose, { Types } from "mongoose";

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

export async function createCourse(data: Partial<CourseData>): Promise<CourseData> {
    try {
        const loggedinUser = await getLoggedInUser();
        data["instructor"] = loggedinUser?.id;
        const course = await create(data);
        return course;
    } catch (e) {
        throw new Error(e as string);
    }
}
 
export async function updateCourse(courseId: string, dataToUpdate): Promise<void> {
    try {
        await Course.findByIdAndUpdate(courseId, dataToUpdate);
    } catch (e) {
        throw new Error(e as string);
    }
}

export async function changeCoursePublishState(courseId: string): Promise<boolean> {
    try {
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
        await Course.findByIdAndDelete(courseId);  
    } catch (err) {
        throw new Error(err as string);
    }
}

export async function updateQuizSetForCourse(courseId: string, dataUpdated: QuizSetUpdate): Promise<void> {
    const data: Partial<CourseData> = {};
    data["quizSet"] = new mongoose.Types.ObjectId(dataUpdated.quizSetId);
    try {
        await Course.findByIdAndUpdate(courseId, data);
    } catch (error) {
        throw new Error(error as string);
    }
}