"use client";

import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { changeCoursePublishState, deleteCourse } from "@/app/actions/course";

interface CourseActionsProps {
  courseId: string;
  isActive: boolean;
}

export const CourseActions: React.FC<CourseActionsProps> = ({ courseId, isActive }) => {
  const [published, setPublished] = useState(isActive);
  const router = useRouter();

  // Función para manejar la acción directamente sin form submit
  async function handleAction(action: "change-active" | "delete") {
    try {
      switch (action) {
        case "change-active": {
          // Aquí asumimos que changeCoursePublishState devuelve el nuevo estado activo (boolean)
          const newActiveState = await changeCoursePublishState(courseId);
          setPublished(newActiveState);
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
            router.push(`/dashboard/courses`);
          }
          break;
        }
      }
    } catch (e: any) {
      toast.error(e.message || "Error inesperado");
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAction("change-active")}
      >
        {published ? "Despublicar" : "Publicar"}
      </Button>

      <Button
        variant="destructive"
        size="sm"
        onClick={() => handleAction("delete")}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};
