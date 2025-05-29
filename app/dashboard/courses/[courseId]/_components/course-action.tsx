"use client";

import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useState } from "react";
 
import { toast } from "sonner";
 
import { useRouter } from "next/navigation";
import { changeCoursePublishState, deleteCourse } from "@/app/actions/course";

export const CourseActions = ({ courseId,isActive }) => {

    const [action, setAction] = useState(null);
    const [published, setPublished] = useState(isActive);
    const router = useRouter();

    async function handleSubmit(event) {
        event.preventDefault();
        //console.log(action);
    try {
        switch (action) {
            case "change-active": {
          const activeState = await changeCoursePublishState(courseId);
                setPublished(!activeState);
                toast.success("Este curso ha sido actualizado");
                router.refresh();
                break;
            }

            case "delete": {
                if (published) {
                    toast.error("Un curso publicado no puede ser eliminado. Primero despublíquelo, después elimínelo.");
                } else {
                    await deleteCourse(courseId);
                    toast.success("El curso ha sido eliminado satisfactoriamente");
                    router.push(`/dashboard/courses`)
                }
                break;
            } 
            default:
                throw new Error("Acción inválida");
        }
    } catch (e) {
        toast.error(e.message);
    } 
    }


  return (
    <form onSubmit={handleSubmit}>
    <div className="flex items-center gap-x-2">
      <Button variant="outline" size="sm" onClick={() => setAction("change-active")}>
        {published ? "Publicar" : "Despublicar"}
      </Button>

      <Button size="sm" onClick={() => setAction("delete")}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>   
    </form>
  );
};
