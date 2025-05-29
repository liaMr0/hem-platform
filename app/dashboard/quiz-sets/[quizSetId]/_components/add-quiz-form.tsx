"use client";

import * as z from "zod";
// import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { addQuizToQuizSet } from "@/app/actions/quiz";

const formSchema = z.object({
  title: z
    .string({
      required_error: "La pregunta es obligatoria",
    })
    .min(1, {
      message: "El título es obligatorio",
    }),
  description: z
    .string({
      required_error: "La descripción es obligatoria",
    })
    .min(1, {
      message: "La descripción es obligatoria",
    }),
  optionA: z.object({
    label: z
      .string({
        required_error: "La opción es obligatoria",
      })
      .min(1, {
        message: "La opción es obligatoria",
      }),
    isTrue: z.boolean().default(false),
  }),
  optionB: z.object({
    label: z
      .string({
        required_error: "La opción es obligatoria",
      })
      .min(1, {
        message: "La opción es obligatoria",
      }),
    isTrue: z.boolean().default(false),
  }),
  optionC: z.object({
    label: z
      .string({
        required_error: "La opción es obligatoria",
      })
      .min(1, {
        message: "La opción es obligatoria",
      }),
    isTrue: z.boolean().default(false),
  }),
  optionD: z.object({
    label: z
      .string({
        required_error: "La opción es obligatoria",
      })
      .min(1, {
        message: "La opción es obligatoria",
      }),
    isTrue: z.boolean().default(false),
  }),
});

export const AddQuizForm = ({ quizSetId }) => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      title: "",
      description: "",
      optionA: { label: "", isTrue: false },
      optionB: { label: "", isTrue: false },
      optionC: { label: "", isTrue: false },
      optionD: { label: "", isTrue: false },
    },
  });

  const { isSubmitting, isValid, errors } = form.formState;

  const onSubmit = async (values) => {
    try {
      const correctness = [
        values.optionA.isTrue,
        values.optionB.isTrue,
        values.optionC.isTrue,
        values.optionD.isTrue,
      ];

      const correctMarked = correctness.filter((c) => c);
      const isOneCorrectMarked = correctMarked.length === 1;

      if (isOneCorrectMarked) {
        await addQuizToQuizSet(quizSetId, values);
        form.reset();
        toast.success("Cuestionario agregado correctamente");
        router.refresh();
      } else {
        toast.error("Debes marcar solo una respuesta correcta");
      }
    } catch (error) {
      toast.error("Algo salió mal.");
    }
  };

  return (
    <div className="mt-6 border bg-gray-50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Agregar nuevo cuestionario
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título de la pregunta</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="Ingresa la pregunta del cuestionario"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción del cuestionario</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isSubmitting}
                    placeholder="Ingresa una descripción para la pregunta"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Opciones A-D */}
          {["A", "B", "C", "D"].map((letter) => (
            <div key={letter} className="space-y-3">
              <FormLabel>Opción {letter}</FormLabel>
              <div className="flex items-start gap-3">
                <FormField
                  control={form.control}
                  name={`option${letter}.isTrue`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`option${letter}.label`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            disabled={isSubmitting}
                            placeholder={`Ingresa la opción ${letter}`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-end gap-x-2">
            <Button disabled={isSubmitting} type="submit">
              Guardar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
