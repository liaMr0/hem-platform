import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { Quizset } from "@/model/quizset-model";
import { Quiz } from "@/model/quizzes-model";
import mongoose from "mongoose";

export async function getAllQuizSets(excludeUnPublished = false) {
  try {
    let quizSets = [];
    if (excludeUnPublished) {
      quizSets = await Quizset.find({ active: true }).lean();
    } else {
      quizSets = await Quizset.find().lean();
    }
    return replaceMongoIdInArray(quizSets);
  } catch (error) {
    console.error('Error in getAllQuizSets:', error);
    throw new Error(`Failed to get quiz sets: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getQuizSetsByInstructor(instructorId: string, excludeUnPublished = false) {
  try {
    // Validar que instructorId sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(instructorId)) {
      throw new Error('Invalid instructor ID format');
    }

    let quizSets = [];
    const filter: any = { instructor: instructorId };

    if (excludeUnPublished) {
      filter.active = true;
    }

    quizSets = await Quizset.find(filter).lean();
    return replaceMongoIdInArray(quizSets);
  } catch (error) {
    console.error('Error in getQuizSetsByInstructor:', error);
    throw new Error(`Failed to get quiz sets by instructor: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getQuizSetById(id: string) {
  try {
    // Validar que id sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('Invalid ObjectId:', id);
      return null;
    }

    const quizSet = await Quizset.findById(id)
      .populate({
        path: "quizIds",
        model: Quiz,
      })
      .lean();

    if (!quizSet) {
      console.error('Quiz set not found:', id);
      return null;
    }

    return replaceMongoIdInObject(quizSet);
  } catch (error) {
    console.error('Error in getQuizSetById:', error);
    throw new Error(`Failed to get quiz set: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function createQuiz(quizData: any) {
  try {
    const quiz = await Quiz.create(quizData);
    return quiz._id.toString();
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw new Error(`Failed to create quiz: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function createQuizSet(quizSetData: any) {
  try {
    const quizSet = await Quizset.create(quizSetData);
    return quizSet._id.toString();
  } catch (error) {
    console.error('Error creating quiz set:', error);
    throw new Error(`Failed to create quiz set: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}