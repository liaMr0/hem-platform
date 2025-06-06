// actions/quiz.ts
"use server"
import { Quizset } from "@/model/quizset-model";
import { getSlug, replaceMongoIdInArray } from '../../lib/convertData';
import { createQuiz, createQuizSet, getQuizSetById } from "@/queries/quizzes";
import { Quiz } from "@/model/quizzes-model";
import mongoose from "mongoose";
import { Assessment } from "@/model/assessment-model";
import { getLoggedInUser } from "@/lib/loggedin-user";
import { createAssessmentReport } from "@/queries/reports";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

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

  // Instructor solo puede modificar sus propios quizzes
  if (loggedInUser.role === 'instructor') {
    // Buscar el quizSet directamente y verificar su instructor
    const quizSet = await Quizset.findById(quizSetId).lean();
    
    if (!quizSet) {
      throw new Error("Quiz set no encontrado");
    }
    
    // Verificar si el instructor del quizSet es el usuario logueado
    return quizSet.instructor.toString() === loggedInUser.id;
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

export async function updateQuizSet(quizset: string, dataToUpdate: any) {
    try {
        const canModify = await canModifyQuiz(quizset);
        
        if (!canModify) {
            throw new Error("No tienes permisos para modificar este quiz");
        }

        await Quizset.findByIdAndUpdate(quizset, dataToUpdate);
        return { success: true };

    } catch (error) {
        console.error("Error updating quiz set:", error);
        throw new Error(error instanceof Error ? error.message : "Error al actualizar el quiz");
    }
}

export async function addQuizToQuizSet(quizSetId: string, quizData: any) {
    try {
        const canModify = await canModifyQuiz(quizSetId);
        
        if (!canModify) {
            throw new Error("No tienes permisos para modificar este quiz");
        }

        const transformedQuizData = {
            title: quizData.title,
            description: quizData.description,
            slug: getSlug(quizData.title),
            options: [
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
                }
            ]
        };

        const createdQuizId = await createQuiz(transformedQuizData);

        const quizSet = await Quizset.findById(quizSetId);
        if (!quizSet) {
            throw new Error("Quiz set no encontrado");
        }
        
        quizSet.quizIds.push(createdQuizId);
        await quizSet.save();
        
        return { success: true, quizId: createdQuizId };
    } catch (error) {
        console.error("Error adding quiz to quiz set:", error);
        throw new Error(error instanceof Error ? error.message : "Error al agregar quiz");
    }
}

export async function deleteQuiz(quizSetId: string, quizId: string) {
    try {
        const canModify = await canModifyQuiz(quizSetId);
        
        if (!canModify) {
            throw new Error("No tienes permisos para modificar este quiz");
        }

        await Quizset.findByIdAndUpdate(quizSetId, {
            $pull: { quizIds: quizId } 
        });

        await Quiz.findByIdAndDelete(quizId);
        
        return { success: true };
    } catch (error) {
        console.error("Error deleting quiz:", error);
        throw new Error(error instanceof Error ? error.message : "Error al eliminar el quiz");
    }
}

export async function deleteQuizSet(quizSetId: string) {
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
    
    return { success: true };
  } catch (error) {
    console.error("Error eliminando quiz set:", error);
    throw new Error(error instanceof Error ? error.message : "Error al eliminar el quiz set");
  }
}

export async function changeQuizPublishState(quizSetId: string) {
    try {
        const canModify = await canModifyQuiz(quizSetId);
        
        if (!canModify) {
            throw new Error("No tienes permisos para modificar este quiz");
        }

        const quiz = await Quizset.findById(quizSetId);
        if (!quiz) {
            throw new Error("Quiz no encontrado");
        }
        
        const res = await Quizset.findByIdAndUpdate(
            quizSetId, 
            { active: !quiz.active }, 
            { new: true, lean: true }
        );
        
        return { success: true, active: res?.active };
    } catch (error) {
        console.error("Error changing quiz publish state:", error);
        throw new Error(error instanceof Error ? error.message : "Error al cambiar el estado del quiz");
    }
}

export async function doCreateQuizSet(values: { title: string }) {
  try {
    // Verificar autenticación
    const session = await auth();
    
    if (!session?.user) {
      throw new Error('No autorizado');
    }

    // Verificar que el usuario tenga permisos
    if (session.user.role !== 'admin' && session.user.role !== 'instructor') {
      throw new Error('Sin permisos para crear cuestionarios');
    }

    console.log('Creating quiz set for user:', session.user.id, 'with title:', values.title);

    // Preparar datos para crear el quiz set
    const quizSetData = {
      title: values.title,
      description: '',
      active: false,
      instructor: session.user.id,
      quizIds: []
    };

    // Crear el quiz set
    const quizSetId = await createQuizSet(quizSetData);
    
    console.log('Quiz set created with ID:', quizSetId);
    
    // Revalidar la página de quiz sets
    revalidatePath('/dashboard/quiz-sets');
    
    return quizSetId;
  } catch (error) {
    console.error('Error in doCreateQuizSet:', error);
    throw new Error(error instanceof Error ? error.message : 'Error al crear el cuestionario');
  }
}

// FUNCIÓN MEJORADA: Procesar respuestas del quiz
export async function addQuizAssessment(courseId: string, quizSetId: string, answers: any[]) {
    try {
        console.log('📝 Processing quiz assessment:', { courseId, quizSetId, answersCount: answers.length });
        
        // Validar parámetros
        if (!courseId || !quizSetId || !answers || !Array.isArray(answers)) {
            throw new Error("Parámetros inválidos para el assessment");
        }

        // Obtener usuario logueado
        const loggedInUser = await getLoggedInUser();
        if (!loggedInUser) {
            throw new Error("Usuario no autenticado");
        }

        // Obtener el quiz set con las preguntas
        const quizSet = await getQuizSetById(quizSetId);
        if (!quizSet || !quizSet.quizIds) {
            throw new Error("Quiz set no encontrado o sin preguntas");
        }

        console.log('🎯 Quiz set loaded:', { 
            title: quizSet.title, 
            questionsCount: quizSet.quizIds.length 
        });

        const quizzes = replaceMongoIdInArray(quizSet.quizIds);

        // Procesar cada pregunta del quiz
        const assessmentRecord = quizzes.map((quiz) => {
            const obj: any = {
                quizId: new mongoose.Types.ObjectId(quiz.id)
            };
            
            // Verificar si el usuario respondió esta pregunta
            const userAnswer = answers.find((a) => a.quizId === quiz.id);
            obj.attempted = !!userAnswer;

            // Procesar las opciones de la pregunta
            const mergedOptions = quiz.options.map((option: any) => {
                let isSelected = false;
                
                // Verificar si esta opción fue seleccionada por el usuario
                if (userAnswer && userAnswer.options && userAnswer.options.length > 0) {
                    isSelected = userAnswer.options.some((selectedOption: any) => 
                        selectedOption.option === option.text
                    );
                }

                return {
                    option: option.text,
                    isCorrect: option.is_correct,
                    isSelected: isSelected,
                };
            });
            
            obj.options = mergedOptions;
            return obj;
        });

        console.log('📊 Assessment record created:', { 
            questionsProcessed: assessmentRecord.length,
            attemptedQuestions: assessmentRecord.filter(r => r.attempted).length
        });

        // Crear el assessment
        const assessmentEntry = {
            assessments: assessmentRecord,
            otherMarks: 0
        };

        const assessment = await Assessment.create(assessmentEntry);
        console.log('✅ Assessment created:', assessment._id);

        // Crear el reporte de assessment
        await createAssessmentReport({ 
            courseId: courseId, 
            userId: loggedInUser.id, 
            quizAssessment: assessment._id 
        });

        console.log('✅ Assessment report created successfully');

        return {
            success: true,
            assessmentId: assessment._id.toString(),
            totalQuestions: quizzes.length,
            attemptedQuestions: assessmentRecord.filter(r => r.attempted).length
        };

    } catch (error) {
        console.error('❌ Error in addQuizAssessment:', error);
        throw new Error(error instanceof Error ? error.message : "Error al procesar el quiz");
    }
}

// NUEVA FUNCIÓN: Obtener resultados del quiz para un usuario
export async function getQuizResults(courseId: string, userId: string) {
    try {
        const { getReport } = await import('@/queries/reports');
        const report = await getReport({ course: courseId, student: userId });
        
        if (!report || !report.quizAssessment) {
            return null;
        }

        const assessment = await Assessment.findById(report.quizAssessment).lean();
        if (!assessment) {
            return null;
        }

        const totalQuestions = assessment.assessments.length;
        const attemptedQuestions = assessment.assessments.filter((q: any) => q.attempted).length;
        const correctAnswers = assessment.assessments.filter((q: any) => 
            q.attempted && q.options.some((opt: any) => opt.isSelected && opt.isCorrect)
        ).length;

        return {
            totalQuestions,
            attemptedQuestions,
            correctAnswers,
            score: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
            totalMarks: totalQuestions * 5,
            obtainedMarks: correctAnswers * 5,
            assessmentDate: report.completion_date || report.created_at
        };

    } catch (error) {
        console.error('Error getting quiz results:', error);
        return null;
    }
}