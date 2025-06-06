// queries/quizzes.ts
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

// ✅ NUEVA FUNCIÓN: Obtener quiz set con todos los detalles para un curso
export async function getQuizSetForCourse(quizSetId: string) {
  try {
    if (!quizSetId || !mongoose.Types.ObjectId.isValid(quizSetId)) {
      console.log('Invalid or missing quiz set ID:', quizSetId);
      return null;
    }

    const quizSet = await Quizset.findById(quizSetId)
      .populate({
        path: "quizIds",
        model: Quiz,
        select: "title description options mark slug"
      })
      .select("title description quizIds active")
      .lean();

    if (!quizSet) {
      console.log('Quiz set not found:', quizSetId);
      return null;
    }

    // Solo devolver si está activo
    if (!quizSet.active) {
      console.log('Quiz set is inactive:', quizSetId);
      return null;
    }

    return replaceMongoIdInObject(quizSet);
  } catch (error) {
    console.error('Error in getQuizSetForCourse:', error);
    return null;
  }
}

// ✅ NUEVA FUNCIÓN: Obtener quiz individual por ID
export async function getQuizById(id: string) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('Invalid quiz ID:', id);
      return null;
    }

    const quiz = await Quiz.findById(id).lean();
    
    if (!quiz) {
      console.error('Quiz not found:', id);
      return null;
    }

    return replaceMongoIdInObject(quiz);
  } catch (error) {
    console.error('Error in getQuizById:', error);
    return null;
  }
}

// ✅ NUEVA FUNCIÓN: Verificar si un quiz set tiene preguntas válidas
export async function validateQuizSet(quizSetId: string) {
  try {
    const quizSet = await getQuizSetById(quizSetId);
    
    if (!quizSet) {
      return { valid: false, reason: 'Quiz set not found' };
    }

    if (!quizSet.active) {
      return { valid: false, reason: 'Quiz set is not active' };
    }

    if (!quizSet.quizIds || quizSet.quizIds.length === 0) {
      return { valid: false, reason: 'Quiz set has no questions' };
    }

    // Verificar que todas las preguntas tengan opciones válidas
    const invalidQuizzes = quizSet.quizIds.filter(quiz => 
      !quiz.options || 
      !Array.isArray(quiz.options) || 
      quiz.options.length === 0 ||
      !quiz.options.some(option => option.is_correct === true)
    );

    if (invalidQuizzes.length > 0) {
      return { 
        valid: false, 
        reason: `${invalidQuizzes.length} question(s) have invalid options` 
      };
    }

    return { 
      valid: true, 
      quizCount: quizSet.quizIds.length,
      totalMarks: quizSet.quizIds.length * 5 
    };
  } catch (error) {
    console.error('Error validating quiz set:', error);
    return { valid: false, reason: 'Validation error' };
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