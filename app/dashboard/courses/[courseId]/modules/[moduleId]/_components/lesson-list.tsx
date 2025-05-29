"use client";

import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CirclePlay } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  active: boolean;
}

interface LessonListProps {
  items: Lesson[];
  onReorder: (updateData: any) => void;
  onEdit: (id: string) => void;
}

export const LessonList = ({ items, onReorder, onEdit }: LessonListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Actualizar el estado local cuando cambien los items del padre
  useEffect(() => {
    setLessons(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedLessons = Array.from(lessons);
    const [reorderedItem] = reorderedLessons.splice(result.source.index, 1);
    reorderedLessons.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedLessons = reorderedLessons.slice(startIndex, endIndex + 1);

    // Actualizar estado local inmediatamente para UI responsiva
    setLessons(reorderedLessons);

    // Crear datos para bulk update
    const bulkUpdateData = updatedLessons.map((lesson) => ({
      id: lesson.id,
      position: reorderedLessons.findIndex((item) => item.id === lesson.id),
    }));

    // Enviar actualización al padre
    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lessons">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {lessons.map((lesson, index) => (
              <Draggable key={lesson.id} draggableId={lesson.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm transition-colors",
                      lesson.active && "bg-sky-100 border-sky-200 text-sky-700",
                      snapshot.isDragging && "shadow-lg"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition cursor-grab active:cursor-grabbing",
                        lesson.active && "border-r-sky-200 hover:bg-sky-200"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    
                    <div className="flex items-center gap-2 flex-1">
                      <CirclePlay 
                        size={18} 
                        className={cn(
                          "text-gray-500",
                          lesson.active && "text-sky-600"
                        )}
                      />
                      <span className="font-medium">{lesson.title}</span>
                    </div>
                    
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      <Badge
                        className={cn(
                          "bg-gray-500 hover:bg-gray-600 text-white text-xs",
                          lesson.active && "bg-emerald-600 hover:bg-emerald-700"
                        )}
                        variant="secondary"
                      >
                        {lesson.active ? "Publicado" : "Borrador"}
                      </Badge>
                      
                      <button
                        onClick={() => onEdit(lesson.id)}
                        className="p-1 rounded hover:bg-slate-300 transition-colors"
                        title="Editar lección"
                      >
                        <Pencil className="w-4 h-4 cursor-pointer hover:opacity-75 transition" />
                      </button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};