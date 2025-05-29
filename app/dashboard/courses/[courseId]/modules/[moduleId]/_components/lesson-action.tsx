"use client";

import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { changeLessonPublishState, deleteLesson } from "@/app/actions/lesson";
import { toast } from "sonner";

export const LessonActions = ({ lesson, moduleId, onDelete, onUpdate }: any) => {
    const [action, setAction] = useState<string | null>(null);
    const [published, setPublished] = useState<boolean>(lesson?.active);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handleSubmit(event: any) {
        event.preventDefault();
        
        if (!action) return;

        setIsLoading(true);
        
        try {
            switch (action) {
                case "change-active": {
                    // Cambiar el estado localmente primero para UI inmediata
                    const newState = !published;
                    setPublished(newState);
                    
                    // Llamar a la función del servidor
                    const result = await changeLessonPublishState(lesson.id);
                    
                    // Verificar si el resultado es consistente
                    if (result !== undefined) {
                        setPublished(result);
                    }
                    
                    // Notificar al componente padre sobre el cambio
                    if (onUpdate) {
                        onUpdate(lesson.id, newState);
                    }
                    
                    toast.success(`La lección ha sido ${newState ? 'publicada' : 'despublicada'}.`);
                    break;
                }

                case "delete": {
                    if (published) {
                        toast.error("Una lección publicada no puede ser eliminada. Primero, anúlela de la publicación y luego elimínela.");
                    } else {
                        await deleteLesson(lesson.id, moduleId);
                        if (onDelete) {
                            onDelete();
                        }
                        toast.success("Lección eliminada correctamente.");
                    }
                    break;
                }
                
                default:
                    throw new Error("Acción de lección inválida.");
            }
        } catch (e: any) {
            // Revertir el estado si hubo error
            if (action === "change-active") {
                setPublished(lesson?.active);
            }
            toast.error(e.message || "Ocurrió un error inesperado.");
        } finally {
            setIsLoading(false);
            setAction(null);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-x-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    type="submit"
                    disabled={isLoading}
                    onClick={() => setAction("change-active")}
                >
                    {isLoading && action === "change-active" 
                        ? "Procesando..." 
                        : published ? "Despublicar" : "Publicar"
                    }
                </Button>

                <Button 
                    size="sm" 
                    type="submit"
                    disabled={isLoading}
                    onClick={() => setAction("delete")}
                    variant="destructive"
                >
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
        </form>
    );
};
