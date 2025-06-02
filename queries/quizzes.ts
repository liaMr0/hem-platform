import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { Quizset } from "@/model/quizset-model";
import { Quiz } from "@/model/quizzes-model";

export async function getAllQuizSets(excludeUnPublished = false) {
    try {
        let quizSets = [];
        if (excludeUnPublished) {
            quizSets = await Quizset.find({active:true}).lean();
        } else {
            quizSets = await Quizset.find().lean();
        }
        return replaceMongoIdInArray(quizSets);
    } catch (error) {
        throw new Error(error);
    } 
}

// Nueva función para obtener cuestionarios por instructor
export async function getQuizSetsByInstructor(instructorId: string, excludeUnPublished = false) {
    try {
        let quizSets = [];
        const filter: any = { instructor: instructorId };
        
        if (excludeUnPublished) {
            filter.active = true;
        }
        
        quizSets = await Quizset.find(filter).lean();
        return replaceMongoIdInArray(quizSets);
    } catch (error) {
        throw new Error(error);
    } 
}

export async function getQuizSetById(id: string) {
    try {
        const quizSet = await Quizset.findById(id)
        .populate({
            path: "quizIds",
            model: Quiz,
        }).lean();
        return replaceMongoIdInObject(quizSet);
    } catch (error) {
        throw new Error(error);
    } 
}

export async function createQuiz(quizData: any) {
    try {
        const quiz = await Quiz.create(quizData);
        return quiz._id.toString();
    } catch (error) {
        throw new Error(error);
    }
}

// Nueva función para crear un conjunto de cuestionarios
export async function createQuizSet(quizSetData: any) {
    try {
        const quizSet = await Quizset.create(quizSetData);
        return quizSet._id.toString();
    } catch (error) {
        throw new Error(error);
    }
}