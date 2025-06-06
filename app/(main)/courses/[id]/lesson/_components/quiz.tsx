"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import QuizModal from "./quiz-modal";

interface QuizProps {
  courseId: string;
  quizSet: {
    _id: string;
    title: string;
    quizIds?: Array<{
      _id: string;
      title: string;
      description: string;
      options: Array<{
        text: string;
        is_correct: boolean;
      }>;
    }>;
  };
  isTaken: boolean;
}

const Quiz = ({ courseId, quizSet, isTaken }: QuizProps) => {
  const [open, setOpen] = useState(false);

  console.log("🎯 Quiz Component Received:", {
    courseId,
    quizSetId: quizSet?._id,
    quizSetTitle: quizSet?.title,
    quizIds: quizSet?.quizIds,
    quizCount: quizSet?.quizIds?.length || 0,
    isTaken
  });

  // ✅ CORRECCIÓN: Verificación más robusta y logging detallado
  if (!quizSet) {
    console.error("❌ No quizSet provided to Quiz component");
    return null;
  }

  if (!quizSet.quizIds || !Array.isArray(quizSet.quizIds) || quizSet.quizIds.length === 0) {
    console.warn("⚠️ QuizSet has no quizIds or empty array:", quizSet.quizIds);
    return (
      <div className="max-w-[270px] bg-white border border-border rounded-md dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
        <div className="flex h-32 items-center justify-center bg-gradient-to-r from-sky-500 to-indigo-500 px-6 text-center">
          <span className="text-lg font-semibold text-white">
            {quizSet?.title || "Quiz Sin Título"}
          </span>
        </div>
        <div className="p-4">
          <p className="mb-4 font-normal text-gray-500 dark:text-gray-400 text-sm">
            No hay preguntas disponibles para este quiz.
          </p>
          <Button
            className="flex gap-2 capitalize border-gray-300 text-gray-500 w-full"
            variant="outline"
            disabled={true}
          >
            <span>Quiz no disponible</span>
          </Button>
        </div>
      </div>
    );
  }

  // ✅ CORRECCIÓN: Transformación más segura de los datos
  const quizzes = quizSet.quizIds.map((quiz, index) => {
    console.log(`🔍 Processing quiz ${index + 1}:`, {
      id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      optionsCount: quiz.options?.length || 0,
      options: quiz.options
    });

    if (!quiz._id || !quiz.title) {
      console.warn(`⚠️ Quiz ${index + 1} missing required fields:`, quiz);
      return null;
    }

    return {
      id: quiz._id.toString(),
      title: quiz.title,
      description: quiz.description || "",
      options: (quiz.options || []).map((option, optIndex) => {
        if (!option.text) {
          console.warn(`⚠️ Option ${optIndex + 1} in quiz ${quiz.title} missing text:`, option);
        }
        return {
          label: option.text || "",
          isTrue: Boolean(option.is_correct)
        };
      }).filter(opt => opt.label) // Solo opciones con texto
    };
  }).filter(Boolean); // Remover quizzes inválidos

  console.log("✅ Final processed quizzes:", quizzes);

  // Calcular total de puntos de forma segura
  const totalMarks = quizzes.length * 5;

  const handleQuizClick = () => {
    console.log("🚀 Opening quiz modal with:", {
      quizzesCount: quizzes.length,
      courseId,
      quizSetId: quizSet._id
    });
    setOpen(true);
  };

  return (
    <>
      <div className="max-w-[270px] bg-white border border-border rounded-md dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
        <div className="flex h-32 items-center justify-center bg-gradient-to-r from-sky-500 to-indigo-500 px-6 text-center">
          <span className="text-lg font-semibold text-white">
            {quizSet?.title || "Quiz Sin Título"}
          </span>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between gap-6 text-sm mb-2 font-medium text-gray-700">
            <span>Total Mark</span>
            <Badge className="bg-success/20 text-primary hover:bg-success/20">
              {totalMarks}
            </Badge>
          </div>
          <p className="mb-4 font-normal text-gray-500 dark:text-gray-400 text-sm">
            Taking the quiz is optional but it is highly recommended
          </p>
          <Button
            className="flex gap-2 capitalize border-sky-500 text-sky-500 hover:text-sky-500 hover:bg-sky-500/5 w-full"
            variant="outline"
            onClick={handleQuizClick}
            disabled={quizzes.length === 0}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="none" d="M0 0h24v24H0V0z"></path>
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zm-6.49-5.84c.41-.73 1.18-1.16 1.63-1.8.48-.68.21-1.94-1.14-1.94-.88 0-1.32.67-1.5 1.23l-1.37-.57C11.51 5.96 12.52 5 13.99 5c1.23 0 2.08.56 2.51 1.26.37.6.58 1.73.01 2.57-.63.93-1.23 1.21-1.56 1.81-.13.24-.18.4-.18 1.18h-1.52c.01-.41-.06-1.08.26-1.66zm-.56 3.79c0-.59.47-1.04 1.05-1.04.59 0 1.04.45 1.04 1.04 0 .58-.44 1.05-1.04 1.05-.58 0-1.05-.47-1.05-1.05z"></path>
            </svg>
            <span>{isTaken ? `Quiz Taken` : `Take Quiz`}</span>
          </Button>
        </div>
      </div>

      {/* ✅ CORRECCIÓN: Renderizar modal independientemente del estado open */}
      <QuizModal 
        quizzes={quizzes}
        courseId={courseId}
        quizSetId={quizSet._id.toString()}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
};

export default Quiz;