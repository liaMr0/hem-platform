"use client";

import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { changeLessonPublishState, deleteLesson } from "@/app/actions/lesson";
import { toast } from "sonner";

export const LessonActions = ({ lesson,moduleId,onDelete }:any) => {

    const [action, setAction] = useState(null);
    const [published, setPublished] = useState(lesson?.active);

    async function handleSubmit(event:any) {
        event.preventDefault();
        //console.log(action);
    try {
        switch (action) {
            case "change-active": {
                const activeState = await changeLessonPublishState(lesson.id);
                setPublished(!activeState);
                toast.success("La lección ha sido actualizada.");
                break;
            }

            case "delete": {
                if (published) {
                    toast.error("Una lección publicada no puede ser eliminada. Primero, anúlela de la publicación y luego elimínela.");
                } else {
                    await deleteLesson(lesson.id,moduleId);
                    onDelete();
                }
                break;
            } 
            default:
                throw new Error("Acción de lección inválida.");
        }
    } catch (e) {
        toast.error(e.message);
    } 
    }


  return (
    <form onSubmit={handleSubmit}>
    <div className="flex items-center gap-x-2">
      <Button variant="outline" size="sm" onClick={() => setAction("change-active")}>
        {published ? "Despublicar" : "Publicar"}
      </Button>

      <Button size="sm" onClick={() => setAction("delete")}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>   
    </form>
  );
};
