"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2, PlusCircle } from "lucide-react";

import { LessonList } from "./lesson-list";
import { LessonModal } from "./lesson-modal";
import { getSlug } from "@/lib/convertData";
import { createLesson, reOrderLesson } from "@/app/actions/lesson";

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
});

interface Lesson {
  id: string;
  title: string;
  description?: string;
  video_url?: string;
  duration?: number;
  active: boolean;
  order: number;
}

interface LessonFormProps {
  initialData: Lesson[];
  moduleId: string;
  courseId: string;
}

export const LessonForm = ({ initialData, moduleId, courseId }: LessonFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>(initialData);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lessonToEdit, setLessonToEdit] = useState<Lesson | null>(null);
  
  const router = useRouter();

  const toggleCreating = () => setIsCreating((current) => !current);
  const toggleEditing = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("slug", getSlug(values.title));
      formData.append("moduleId", moduleId);
      formData.append("order", lessons.length.toString());

      const lesson = await createLesson(formData);

      const newLesson: Lesson = {
        id: lesson?._id.toString(),
        title: values.title,
        active: false,
        order: lessons.length,
      };

      setLessons((prevLessons) => [...prevLessons, newLesson]);
      
      toast.success("Lección creada correctamente.");
      toggleCreating();
      form.reset();
      router.refresh();
    } catch (error) {
      console.error("Error creating lesson:", error);
      toast.error("Algo salió mal.");
    }
  };

  const onReorder = async (updateData: Array<{ id: string; position: number }>) => {
    try {
      setIsUpdating(true);
      await reOrderLesson(updateData);
      toast.success("Lecciones reordenadas.");
      router.refresh();
    } catch (error) {
      console.error("Error reordering lessons:", error);
      toast.error("Algo salió mal.");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = useCallback((id: string) => {
    const foundLesson = lessons.find((lesson) => lesson.id === id);
    if (foundLesson) {
      setLessonToEdit(foundLesson);
      setIsEditing(true);
    }
  }, [lessons]);

  // Función para actualizar el estado de publicación de una lección específica
  const onLessonUpdate = useCallback((lessonId: string, newActiveState: boolean) => {
    setLessons((prevLessons) =>
      prevLessons.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, active: newActiveState } : lesson
      )
    );
    
    // También actualizar lessonToEdit si es la misma lección
    if (lessonToEdit && lessonToEdit.id === lessonId) {
      setLessonToEdit((prev) => prev ? { ...prev, active: newActiveState } : null);
    }
  }, [lessonToEdit]);

  // Función para eliminar una lección de la lista
  const onLessonDelete = useCallback(() => {
    if (lessonToEdit) {
      setLessons((prevLessons) =>
        prevLessons.filter((lesson) => lesson.id !== lessonToEdit.id)
      );
    }
    setIsEditing(false);
    setLessonToEdit(null);
    router.refresh();
  }, [lessonToEdit, router]);

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-gray-500/20 top-0 right-0 rounded-md flex items-center justify-center z-10">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      
      <div className="font-medium flex items-center justify-between">
        Lecciones del Módulo
        <Button variant="ghost" onClick={toggleCreating}>
          {isCreating ? (
            <>Cancelar</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Agregar lección
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="ej: Introducción al curso..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
      
      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !lessons?.length && "text-slate-500 italic"
          )}
        >
          {!lessons?.length ? (
            <p>No hay lecciones. Agrega tu primera lección arriba.</p>
          ) : (
            <LessonList
              onEdit={onEdit}
              onReorder={onReorder}
              items={lessons}
            />
          )}
        </div>
      )}
      
      {!isCreating && lessons?.length > 0 && (
        <p className="text-xs text-muted-foreground mt-4">
          Arrastre y suelte para cambiar el orden de las lecciones.
        </p>
      )}
      
      {lessonToEdit && (
        <LessonModal 
          open={isEditing} 
          setOpen={setIsEditing} 
          courseId={courseId} 
          lesson={lessonToEdit} 
          moduleId={moduleId}
          onUpdate={onLessonUpdate}
          onDelete={onLessonDelete}
        />
      )}
    </div>
  );
};