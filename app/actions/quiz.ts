// actions/quiz.ts
"use server"
import { Quizset } from "@/model/quizset-model";
import { getSlug, replaceMongoIdInArray } from '../../lib/convertData';
import { createQuiz, getQuizSetById } from "@/queries/quizzes";
import { Quiz } from "@/model/quizzes-model";
import mongoose from "mongoose";
import { Assessment } from "@/model/assessment-model";
import { getLoggedInUser } from "@/lib/loggedin-user";
import { createAssessmentReport } from "@/queries/reports";
import { Course } from "@/model/course-model";

// Helper function to check if user can modify quiz
async function canModifyQuiz(quizSetId: string): Promise<boolean> {
  const loggedInUser = await getLoggedInUser();
  
  if (!loggedInUser) {
    throw new Error("Usuario no autenticado");
  }

  // Admin puede modificar cualquier quiz
  if (loggedInUser.role === 'admin') {
    return true;
  }

  // Instructor solo puede modificar quizzes de sus propios cursos
  if (loggedInUser.role === 'instructor') {
    // Buscar el curso que contiene este quizSet
    const course = await Course.findOne({ quizSet: quizSetId }).lean();
    
    if (!course) {
      throw new Error("Quiz no encontrado o no asociado a ningún curso");
    }
    
    return course.instructor.toString() === loggedInUser.id;
  }

  return false;
}

// Helper function to check if user can modify quiz set (for creation)
async function canCreateQuizSet(): Promise<boolean> {
  const loggedInUser = await getLoggedInUser();
  
  if (!loggedInUser) {
    throw new Error("Usuario no autenticado");
  }

  // Solo admin e instructor pueden crear quiz sets
  return ['admin', 'instructor'].includes(loggedInUser.role);
}

export async function updateQuizSet(quizset, dataToUpdate){
    try {
        const canModify = await canModifyQuiz(quizset);
        
        if (!canModify) {
            throw new Error("No tienes permisos para modificar este quiz");
        }

        await Quizset.findByIdAndUpdate(quizset, dataToUpdate);

    } catch (error) {
        throw new Error(error);
    }
}

export async function addQuizToQuizSet(quizSetId:string, quizData:any){
    try {
        const canModify = await canModifyQuiz(quizSetId);
        
        if (!canModify) {
            throw new Error("No tienes permisos para modificar este quiz");
        }

        //console.log(quizSetId,quizData);
        const transformedQuizData = {};
        transformedQuizData["title"] = quizData["title"];
        transformedQuizData["description"] = quizData["description"];
        transformedQuizData["slug"] = getSlug(quizData["title"]);
        transformedQuizData["options"] = [
            {
                text: quizData.optionA.label,
                is_correct: quizData.optionA.isTrue  
            },
            {
                text: quizData.optionB.label,
                is_correct: quizData.optionB.isTrue  
            },
            {
                text: quizData.optionC.label,
                is_correct: quizData.optionC.isTrue  
            },
            {
                text: quizData.optionD.label,
                is_correct: quizData.optionD.isTrue  
            }, 
        ];
        //console.log(transformedQuizData);

        const createdQuizId = await createQuiz(transformedQuizData);

        const quizSet = await Quizset.findById(quizSetId);
        quizSet.quizIds.push(createdQuizId);
        quizSet.save();
    } catch (error) {
        throw new Error(error);
    }
}

export async function deleteQuiz(quizSetId:string, quizId:string) {
    try {
        const canModify = await canModifyQuiz(quizSetId);
        
        if (!canModify) {
            throw new Error("No tienes permisos para modificar este quiz");
        }

        await Quizset.findByIdAndUpdate(quizSetId, {
            $pull: {quizIds:quizId } 
        });

        await Quiz.findByIdAndDelete(quizId);
        
    } catch (error) {
        throw new Error(error as string);
    }
}

export async function deleteQuizSet(quizSetId:string) {
  try {
    const canModify = await canModifyQuiz(quizSetId);
    
    if (!canModify) {
        throw new Error("No tienes permisos para eliminar este quiz");
    }

    const quizSet = await Quizset.findById(quizSetId);

    if (!quizSet) {
      throw new Error("QuizSet no encontrado");
    }

    // Elimina todos los quizzes asociados
    await Quiz.deleteMany({ _id: { $in: quizSet.quizIds } });

    // Elimina el quiz set
    await Quizset.findByIdAndDelete(quizSetId);
  } catch (error) {
    console.error("Error eliminando quiz set:", error);
    throw new Error(error.message || "Error al eliminar el quiz set");
  }
}

export async function changeQuizPublishState(quizSetId:string) {
    try {
        const canModify = await canModifyQuiz(quizSetId);
        
        if (!canModify) {
            throw new Error("No tienes permisos para modificar este quiz");
        }

        const quiz = await Quizset.findById(quizSetId);
        const res = await Quizset.findByIdAndUpdate(quizSetId, {active: !quiz.active},{lean: true});
        return res.active;
    } catch (error) {
        throw new Error(error);
    }
}

export async function doCreateQuizSet(data){
    try {
        const canCreate = await canCreateQuizSet();
        
        if (!canCreate) {
            throw new Error("No tienes permisos para crear quiz sets");
        }

        data['slug'] = getSlug(data.title);
        const createdQuizSet = await Quizset.create(data);
        return createdQuizSet?._id.toString();
    } catch (error) {
        throw new Error(error);
    }
}

export async function addQuizAssessment(courseId:string,quizSetId:string,answers:any) {
    try {
        console.log(quizSetId,answers);
        const quizSet = await getQuizSetById(quizSetId);
        const quizzes = replaceMongoIdInArray(quizSet.quizIds);

        const assessmentRecord = quizzes.map((quiz) => {
            const obj = {};
            obj.quizId = new mongoose.Types.ObjectId(quiz.id);
            const found = answers.find((a) => a.quizId === quiz.id);
            if (found) {
                obj.attempted = true;
            } else {
                obj.attempted = false;
            }

        const mergedOptions = quiz.options.map((o) => {
            return {
                option: o.text,
                isCorrect: o.is_correct, 
                isSelected: (function () {
                    const found = answers.find((a) => a.options[0].option === o.text);
                    if (found) {
                        return true;
                    } else {
                        return false;
                    }
                })(),
            };
        }); 
        
        obj["options"] = mergedOptions;
        return obj;  
      });

      const assessmentEntry = {};
      assessmentEntry.assessments = assessmentRecord;
      assessmentEntry.otherMarks = 0;

      const assessment = await Assessment.create(assessmentEntry);
      const loggedInUser = await getLoggedInUser();

      await createAssessmentReport({ courseId:courseId, userId:loggedInUser.id, quizAssessment: assessment?._id }); 

    } catch (error) {
        throw new Error(error);
    }
}