"use client";

import { addQuizAssessment } from "@/app/actions/quiz";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, useEffect } from "react";
import { toast } from "sonner";

interface QuizOption {
  label: string;
  isTrue: boolean;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  options: QuizOption[];
}

interface Answer {
  quizId: string;
  options: { option: string }[];
}

interface QuizModalProps {
  quizzes: Quiz[];
  courseId: string;
  quizSetId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

function QuizModal({ quizzes, courseId, quizSetId, open, setOpen }: QuizModalProps) {
  const router = useRouter();
  const totalQuizzes = quizzes?.length || 0;
  const [quizIndex, setQuizIndex] = useState(0);
  const lastQuizIndex = totalQuizzes - 1;
  const currentQuiz = quizzes?.[quizIndex];
  const [answers, setAnswers] = useState<Answer[]>([]);

  // 🔍 DEBUGGING: Agregar useEffect para monitorear cambios
  useEffect(() => {
    console.log("QuizModal - Props received:");
    console.log("- quizzes:", quizzes);
    console.log("- courseId:", courseId);
    console.log("- quizSetId:", quizSetId);
    console.log("- open:", open);
    console.log("- totalQuizzes:", totalQuizzes);
    console.log("- currentQuiz:", currentQuiz);
  }, [quizzes, courseId, quizSetId, open, totalQuizzes, currentQuiz]);

  // 🔍 DEBUGGING: Log cuando el modal debería abrirse
  useEffect(() => {
    if (open) {
      console.log("🚀 QuizModal should be OPEN now!");
      console.log("Dialog open prop:", open);
    } else {
      console.log("❌ QuizModal should be CLOSED");
    }
  }, [open]);

  // ❌ PROBLEMA POTENCIAL: Esta validación podría estar causando el problema
  // Si quizzes está vacío, el modal no se renderiza en absoluto
  // Comentemos esto temporalmente para debug
  /*
  if (!quizzes || quizzes.length === 0) {
    console.log("⚠️ QuizModal: No quizzes provided, returning null");
    return null;
  }
  */

  // 🔍 DEBUGGING: Renderizar mensaje si no hay quizzes
  if (!quizzes || quizzes.length === 0) {
    console.log("⚠️ QuizModal: No quizzes provided, showing debug dialog");
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[95%] block">
          <DialogTitle>Debug - No Quizzes</DialogTitle>
          <div className="p-4">
            <p>No quizzes were provided to the modal.</p>
            <p>Quizzes: {JSON.stringify(quizzes)}</p>
            <p>Open: {open.toString()}</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const quizChangeHandler = (type: "next" | "prev") => {
    console.log("🔄 Quiz navigation:", type);
    const nextQuizIndex = quizIndex + 1;
    const prevQuizIndex = quizIndex - 1;

    if (type === "next" && nextQuizIndex <= lastQuizIndex) {
      setQuizIndex(prev => prev + 1);
    }

    if (type === "prev" && prevQuizIndex >= 0) {
      setQuizIndex(prev => prev - 1);
    }
  };

  const updateAnswer = (
    event: ChangeEvent<HTMLInputElement>, 
    quizId: string, 
    quizTitle: string, 
    selected: string
  ) => {
    const checked = event.target.checked;
    console.log("📝 Answer updated:", { quizId, selected, checked });

    if (!checked) return;

    const answer: Answer = {
      quizId: quizId,
      options: [{ option: selected }]
    };

    console.log("Respuesta actualizada:", answer);

    // Filtrar respuestas anteriores para este quiz
    const filteredAnswers = answers.filter(a => a.quizId !== answer.quizId);
    setAnswers([...filteredAnswers, answer]);
  };

  const submitQuiz = async () => {
    console.log("📤 Submitting quiz with answers:", answers);
    try {
      if (answers.length === 0) {
        toast.error("Por favor responde al menos una pregunta.");
        return;
      }

      await addQuizAssessment(courseId, quizSetId, answers);
      setOpen(false);
      router.refresh();
      toast.success("Gracias por enviar el cuestionario.");
    } catch (error) {
      console.error("Error al enviar quiz:", error);
      toast.error("Hubo un problema al enviar el cuestionario.");
    }
  };

  console.log("🎯 QuizModal rendering with open =", open);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[95%] block">
        <DialogTitle className="sr-only">Detalles del Quiz</DialogTitle>
        
        {/* 🔍 DEBUGGING: Mostrar información de debug */}
        <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
          <div>Debug Info:</div>
          <div>Open: {open.toString()}</div>
          <div>Total Quizzes: {totalQuizzes}</div>
          <div>Current Quiz Index: {quizIndex}</div>
          <div>Current Quiz Title: {currentQuiz?.title || 'No title'}</div>
        </div>
        
        <div className="pb-4 border-b border-border text-sm">
          <span className="text-green-600 inline-block mr-1">
            {quizIndex + 1} / {totalQuizzes}
          </span>
          Pregunta
        </div>

        <div className="py-4">
          <h3 className="text-xl font-medium mb-10 flex items-center gap-2">
            <svg
              className="text-green-600 inline"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                stroke="currentColor"
                d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z"
              />
            </svg>
            {currentQuiz?.title || "Pregunta sin título"}
          </h3>

          <span className="text-[10px] block text-end text-gray-500">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              version="1.1"
              viewBox="0 0 16 16"
              className="text-green-600 inline"
              height="12"
              width="12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7 4.75c0-0.412 0.338-0.75 0.75-0.75h0.5c0.412 0 0.75 0.338 0.75 0.75v0.5c0 0.412-0.338 0.75-0.75 0.75h-0.5c-0.412 0-0.75-0.338-0.75-0.75v-0.5z" />
              <path d="M10 12h-4v-1h1v-3h-1v-1h3v4h1z" />
              <path d="M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 14.5c-3.59 0-6.5-2.91-6.5-6.5s2.91-6.5 6.5-6.5 6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5z" />
            </svg>{" "}
            Una pregunta puede tener múltiples respuestas y no hay penalización por selecciones incorrectas.
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-6">
          {currentQuiz?.options?.map((option, index) => (
            <div key={`${option.label}-${index}`}>
              <input
                className="opacity-0 invisible absolute [&:checked_+_label]:bg-green-100 [&:checked_+_label]:border-green-400"
                type="radio"
                name={`answer-${quizIndex}`}
                onChange={(e) =>
                  updateAnswer(
                    e,
                    currentQuiz.id,
                    currentQuiz.title,
                    option.label
                  )
                }
                id={`option-${quizIndex}-${index}`}
              />
              <Label
                className="border border-gray-300 rounded px-2 py-3 block cursor-pointer hover:bg-gray-50 transition-all font-normal"
                htmlFor={`option-${quizIndex}-${index}`}
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>

        <DialogFooter className="flex gap-4 justify-between w-full sm:justify-between">
          <Button
            className="gap-2 rounded-3xl"
            disabled={quizIndex === 0}
            onClick={() => quizChangeHandler("prev")}
            variant="outline"
          >
            <ArrowLeft /> Pregunta Anterior
          </Button>

          <Button 
            className="gap-2 rounded-3xl bg-green-600 hover:bg-green-700"
            type="button" 
            onClick={submitQuiz}
          >
            Enviar Quiz
          </Button>

          <Button
            className="gap-2 rounded-3xl"
            disabled={quizIndex >= lastQuizIndex}
            onClick={() => quizChangeHandler("next")}
            variant="outline"
          >
            Siguiente Pregunta <ArrowRight />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default QuizModal;