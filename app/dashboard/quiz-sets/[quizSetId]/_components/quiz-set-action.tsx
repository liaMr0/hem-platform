"use client";

import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { changeQuizPublishState, deleteQuizSet } from "@/app/actions/quiz";
import { toast } from "sonner";

export const QuizSetAction = ({ quizSetId, quiz, quizId }) => {
  const [action, setAction] = useState(null);
  const [published, setPublished] = useState(quiz);
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      switch (action) {
        case "change-active": {
          const activeState = await changeQuizPublishState(quizSetId);
          setPublished(!activeState);
          toast.success("El estado del cuestionario ha sido actualizado");
          router.refresh();
          break;
        }
        case "delete": {
          if (published) {
            toast.error("No se puede eliminar un cuestionario publicado. Primero despublica, luego elimina.");
          } else {
            await deleteQuizSet(quizSetId);
            toast.success("El cuestionario ha sido eliminado");
            router.push(`/dashboard/quiz-sets`);
          }
          break;
        }
        default: {
          throw new Error("Acción inválida");
        }
      }
    } catch (e) {
      toast.error(`Error: ${e.message}`);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAction("change-active")}
        >
          {published ? "Despublicar" : "Publicar"}
        </Button>

        <Button
          variant="destructive"
          type="submit"
          name="action"
          value="delete"
          size="sm"
          onClick={() => setAction("delete")}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
