"use client"
import React, { useState } from 'react';
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { deleteQuiz } from '@/app/actions/quiz';

export const QuizCardActions = ({ quiz, quizSetId }) => {
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);

      switch (action) {
        case "edit-quiz": {
          console.log(`Editando cuestionario: ${quiz.id} en el set: ${quizSetId}`);
          break;
        }
        case "delete-quiz": {
          await deleteQuiz(quizSetId, quiz.id);
          toast.success("El cuestionario ha sido eliminado");
          router.refresh();
          break;
        }
        default: {
          throw new Error("Acción inválida");
        }
      }
    } catch (e) {
      toast.error(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setAction("edit-quiz")}
        disabled={loading}
      >
        <Pencil className="w-3 mr-1" /> Editar
      </Button>
      <Button
        className="text-destructive"
        variant="ghost"
        size="sm"
        onClick={() => setAction("delete-quiz")}
        disabled={loading}
      >
        <Trash className="w-3 mr-1" /> Eliminar
      </Button>
    </form>
  );
};
