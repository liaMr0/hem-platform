import AlertBanner from "@/components/alert-banner";
import { QuizSetAction } from "./_components/quiz-set-action";
import { TitleForm } from "./_components/title-form";
import { AddQuizForm } from "./_components/add-quiz-form";
import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";
import { Circle } from "lucide-react";
import { getQuizSetById } from "@/queries/quizzes";
import { QuizCardActions } from "./_components/quiz-card-action";

// ✅ CORRECCIÓN: Tipar correctamente los parámetros
interface EditQuizSetProps {
  params: Promise<{ quizSetId: string }>;
}

const EditQuizSet = async ({ params }: EditQuizSetProps) => {
  try {
    // ✅ CORRECCIÓN: Await params y validar
    console.log('Raw params before await:', params);
    const resolvedParams = await params;
    console.log('Resolved params:', resolvedParams);
    console.log('Type of resolvedParams:', typeof resolvedParams);
    
    // ✅ Extraer quizSetId con validación adicional
    let quizSetId: string;
    
    if (typeof resolvedParams === 'object' && resolvedParams !== null) {
      quizSetId = resolvedParams.quizSetId;
    } else {
      console.error('Resolved params is not an object:', resolvedParams);
      return (
        <div className="p-6">
          <AlertBanner
            label="Error en los parámetros de la URL."
            variant="destructive"
          />
        </div>
      );
    }
    
    console.log('Extracted quizSetId:', quizSetId);
    console.log('Type of quizSetId:', typeof quizSetId);
    
    // ✅ Validar que quizSetId es una string válida
    if (!quizSetId || typeof quizSetId !== 'string' || quizSetId.trim() === '') {
      console.error('Invalid quizSetId:', quizSetId, 'Type:', typeof quizSetId);
      return (
        <div className="p-6">
          <AlertBanner
            label="ID de cuestionario inválido."
            variant="destructive"
          />
        </div>
      );
    }

    // ✅ Limpiar el ID por si tiene codificación URL
    const cleanQuizSetId = decodeURIComponent(quizSetId.trim());
    console.log('Clean quizSetId:', cleanQuizSetId);
    
    const quizSet = await getQuizSetById(cleanQuizSetId);
    
    // Verificar que el quizSet existe
    if (!quizSet) {
      return (
        <div className="p-6">
          <AlertBanner
            label="Quiz set no encontrado."
            variant="destructive"
          />
        </div>
      );
    }

    // Procesar los quizzes de manera más segura
    const quizzes = (quizSet.quizIds || []).map(quiz => {
      // Verificar que el quiz tiene los datos necesarios
      if (!quiz) {
        console.error('Quiz is null or undefined');
        return null;
      }

      // Manejar diferentes formatos de ID
      const quizId = quiz.id || quiz._id;
      
      if (!quizId) {
        console.error('Quiz missing ID:', quiz);
        return null;
      }

      return {
        id: typeof quizId === 'string' ? quizId : quizId.toString(),
        title: quiz.title || 'Sin título',
        options: (quiz.options || []).map(option => ({
          label: option.text || option.label || '',
          isTrue: option.is_correct || option.isTrue || false,
        }))
      };
    }).filter(Boolean); // Eliminar elementos null

    console.log('Processed quizzes:', quizzes);

    return (
      <>
        {!quizSet.active && (
          <AlertBanner
            label="Este cuestionario no está publicado. No será visible en el curso."
            variant="warning"
          />
        )}
        
        <div className="p-6">
          <div className="flex items-center justify-end">
            <QuizSetAction 
              quizSetId={cleanQuizSetId} 
              quiz={quizSet?.active} 
              quizId={quizSet?.id} 
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-16">
            {/* Quiz List */}
            <div className="max-lg:order-2">
              <h2 className="text-xl mb-6">Lista de cuestionarios</h2>
              
              {quizzes.length === 0 && (
                <AlertBanner
                  label="No hay cuestionarios en el conjunto, añada algunos utilizando el formulario de arriba."
                  variant="warning"
                  className="rounded mb-6"
                />
              )}
              
              <div className="space-y-6">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="bg-gray-50 shadow-md p-4 lg:p-6 rounded-md border"
                  >
                    <h2 className="mb-3">{quiz.title}</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {quiz.options.map((option, index) => (
                        <div
                          className={cn(
                            "py-1.5 rounded-sm text-sm flex items-center gap-1 text-gray-600"
                          )}
                          key={`${quiz.id}-option-${index}`}
                        >
                          {option.isTrue ? (
                            <CircleCheck className="size-4 text-emerald-500" />
                          ) : (
                            <Circle className="size-4" />
                          )}
                          <p>{option.label}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-end gap-2 mt-6">
                      <QuizCardActions quiz={quiz} quizSetId={cleanQuizSetId} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Form Section */}
            <div>
              <div className="flex items-center gap-x-2">
                <h2 className="text-xl">Personalice su conjunto de preguntas</h2>
              </div>
              
              <div className="max-w-[800px]">
                <TitleForm
                  initialData={{ title: quizSet.title }}
                  quizSetId={cleanQuizSetId}
                />
              </div>

              <div className="max-w-[800px]">
                <AddQuizForm quizSetId={cleanQuizSetId} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error en EditQuizSet:", error);
    console.error("Error stack:", error.stack);
    
    return (
      <div className="p-6">
        <AlertBanner
          label={`Error al cargar el conjunto de preguntas: ${error instanceof Error ? error.message : 'Error desconocido'}`}
          variant="destructive"
        />
      </div>
    );
  }
};

export default EditQuizSet;