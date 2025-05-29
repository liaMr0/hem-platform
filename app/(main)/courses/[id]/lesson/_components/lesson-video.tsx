// _components/lesson-video.tsx (corregido)
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player/youtube";

interface Lesson {
  id: string;
  title: string;
  video_url: string;
  description?: string;
}

interface LessonVideoProps {
  courseId: string;
  lesson: Lesson;
  module: string;
}

export const LessonVideo = ({ courseId, lesson, module }: LessonVideoProps) => {
  const [hasWindow, setHasWindow] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  useEffect(() => {
    async function updateLessonWatch() {
      if (!started || !isClient) return;

      try {
        const response = await fetch("/api/lesson-watch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId: courseId,
            lessonId: lesson.id,
            moduleSlug: module,
            state: "started",
            lastTime: 0
          })
        });

        if (response.ok) {
          console.log("Lección iniciada correctamente");
          setStarted(false);
        } else {
          console.error("Error al marcar lección como iniciada");
        }
      } catch (error) {
        console.error("Error al actualizar estado de lección:", error);
      }
    }

    updateLessonWatch();
  }, [started, courseId, lesson.id, module, isClient]);

  useEffect(() => {
    async function updateLessonWatch() {
      if (!ended || !isClient) return;

      try {
        const response = await fetch("/api/lesson-watch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId: courseId,
            lessonId: lesson.id,
            moduleSlug: module,
            state: "completed",
            lastTime: duration
          })
        });

        if (response.ok) {
          console.log("Lección completada correctamente");
          setEnded(false);
          router.refresh();
        } else {
          console.error("Error al marcar lección como completada");
        }
      } catch (error) {
        console.error("Error al completar lección:", error);
      }
    }

    updateLessonWatch();
  }, [ended, courseId, lesson.id, module, duration, router, isClient]);

  function handleOnStart() {
    console.log("Video iniciado");
    setStarted(true);
  }

  function handleOnEnded() {
    console.log("Video terminado");
    setEnded(true);
  }

  function handleOnDuration(duration: number) {
    console.log("Duración del video:", duration);
    setDuration(duration);
  }

  function handleOnProgress() {
    // console.log("Progreso del video");
  }

  // Validar que la lección y la URL del video existan
  if (!lesson || !lesson.video_url) {
    return (
      <div className="w-full h-[470px] bg-gray-100 flex items-center justify-center rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Video no disponible
          </h3>
          <p className="text-gray-500">
            Esta lección no tiene un video configurado.
          </p>
        </div>
      </div>
    );
  }

  // Mostrar loading mientras se inicializa el componente
  if (!isClient || !hasWindow) {
    return (
      <div className="w-full h-[470px] bg-gray-100 flex items-center justify-center rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Cargando video...
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <ReactPlayer
        url={lesson.video_url}
        width="100%"
        height="470px"
        controls={true}
        onStart={handleOnStart}
        onDuration={handleOnDuration}
        onProgress={handleOnProgress}
        onEnded={handleOnEnded}
        config={{
          youtube: {
            playerVars: {
              showinfo: 1,
              controls: 1,
              modestbranding: 1,
              rel: 0
            }
          }
        }}
      />
    </div>
  );
};