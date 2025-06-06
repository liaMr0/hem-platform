"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import { doCreateQuizSet } from "@/app/actions/quiz";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "El título es requerido",
  }).max(100, {
    message: "El título no puede tener más de 100 caracteres",
  }),
}); 

const AddQuizSetForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log('Creating quiz set with values:', values);
      
      const result = await doCreateQuizSet(values);
      console.log('Quiz set creation result:', result);
      
      // Validar que result es un string válido (ObjectId)
      if (!result || typeof result !== 'string') {
        console.error('Invalid result type:', typeof result, result);
        throw new Error('Respuesta inválida del servidor');
      }
      
      // Validar formato de ObjectId
      if (!/^[0-9a-fA-F]{24}$/.test(result)) {
        console.error('Invalid ObjectId format:', result);
        throw new Error('ID de cuestionario inválido');
      }
      
      console.log('Redirecting to quiz set:', result);
      
      // Mostrar mensaje de éxito antes de redirigir
      toast.success("Conjunto de cuestionarios creado correctamente.");
      
      // Redirigir después de un pequeño delay
      setTimeout(() => {
        router.push(`/dashboard/quiz-sets/${result}`);
      }, 1000);
      
    } catch (error) {
      console.error("Error creating quiz set:", error);
      toast.error(error instanceof Error ? error.message : "Algo salió mal.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div className="max-w-full w-[536px]">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Crear Nuevo Conjunto de Cuestionarios</h1>
          <p className="text-gray-600">Complete los detalles para crear un nuevo conjunto de cuestionarios</p>
        </div>
        
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título del Conjunto de Cuestionarios</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Escriba el título del conjunto de cuestionarios"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Este será el nombre que verán los estudiantes
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Link href="/dashboard/quiz-sets">
                <Button variant="outline" type="button" disabled={isSubmitting}>
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? "Creando..." : "Continuar"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddQuizSetForm;