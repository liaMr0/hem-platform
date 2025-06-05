"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form, 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { VideoPlayer } from "@/components/video-player";
import { formatDuration} from "@/lib/date";
import { updateLesson } from "@/app/actions/lesson";
 
const formSchema = z.object({
  url: z.string().min(1, {
    message: "Required",
  }),
  duration: z.string().min(1, {
    message: "Required",
  }),
});

export const VideoUrlForm = ({ initialData, courseId, lessonId }:any) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  // Solución: Asegurar que los valores nunca sean null
  const [state, setState] = useState({
    url: initialData?.url || "", // Usar string vacío en lugar de null
    duration: formatDuration(initialData?.duration) || "", // Usar string vacío en lugar de null
  });

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: state,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values:any) => {
    try {
      const payload = {};
      payload["video_url"] = values?.url;
      const duration = values?.duration;
      const splitted = duration.split(":");
      if (splitted.length === 3) {
        payload["duration"] = splitted[0] * 3600 + splitted[1] * 60 + splitted[2] * 1;
        await updateLesson(lessonId,payload)
        
        // Actualizar el estado local con los nuevos valores
        setState({
          url: values?.url || "",
          duration: values?.duration || "",
        });
        
        toast.success("Lección actualizada.");
        toggleEdit();
        router.refresh();
      } else {
        toast.error("El formato de duración debe ser hh:mm:ss");
      } 
    } catch {
      toast.error("Algo salió mal.");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Video URL
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancelar</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Editar Url
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          <p className="text-sm mt-2">
            {state?.url || "No hay URL configurada"}
          </p>
          {state?.url && (
            <div className="mt-6">
              <VideoPlayer url={state?.url} />
            </div>
          )}
        </>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            {/* url */}
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Url del video</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="https://www.youtube.com/watch?v"
                      {...field}
                      value={field.value || ""} // Asegurar que nunca sea null
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* duration */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duración del video</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="10:30:18"
                      {...field}
                      value={field.value || ""} // Asegurar que nunca sea null
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Guardar
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};