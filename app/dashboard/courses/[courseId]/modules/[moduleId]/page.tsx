import AlertBanner from "@/components/alert-banner";
import { IconBadge } from "@/components/icon-badge";
import {
  ArrowLeft,
  BookOpenCheck,
  Eye,
  LayoutDashboard, 
  Video,
} from "lucide-react";
import Link from "next/link";
import { ModuleTitleForm } from "./_components/module-title-form";
import { LessonForm } from "./_components/lesson-form";
import { CourseActions } from "../../_components/course-action";
import { getModule } from "@/queries/modules";
import { replaceMongoIdInArray } from "@/lib/convertData";
import { ObjectId } from "mongodb";
import { ModuleActions } from "./_components/module-action";

interface ModulePageProps {
  params: {
    courseId: string;
    moduleId: string;
  };
}

const Module = async ({ params}: ModulePageProps) => {
  // Obtener datos del módulo
  const { courseId, moduleId } = await params;
  const module = await getModule(moduleId);
  const sanitizedModule = sanitizeData(module);

  // Sanitize function for handle ObjectID and Buffer
  function sanitizeData(data: any) {
    return JSON.parse(
      JSON.stringify(data, (key, value) => {
        if (value instanceof ObjectId) {
          return value.toString();
        }
        if (Buffer.isBuffer(value)) {
          return value.toString("base64");
        }
        return value;
      })
    );
  }

  // Obtener y sanitizar lecciones
  const rawLessons = await replaceMongoIdInArray(module?.lessonIds).sort(
    (a: any, b: any) => a.order - b.order
  );
  
  const lessons = sanitizeData(rawLessons).map((lesson: any) => ({
    id: lesson.id || lesson._id,
    title: lesson.title,
    description: lesson.description,
    video_url: lesson.video_url,
    duration: lesson.duration,
    active: lesson.active || false, // Asegurar que active esté definido
    order: lesson.order,
  }));

  return (
    <>
      {!module?.active && (
        <AlertBanner
          label="Este módulo no está publicado. No será visible en el curso."
          variant="warning"
        />
      )}

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/dashboard/courses/${courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la configuración del curso
            </Link>
            <div className="flex items-center justify-end">
              <ModuleActions module={sanitizedModule} courseId={courseId} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Personaliza tu módulo</h2>
              </div>
              <ModuleTitleForm 
                initialData={{ title: module.title }} 
                courseId={courseId} 
                chapterId={moduleId} 
              />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={BookOpenCheck} />
                <h2 className="text-xl">Lecciones del módulo</h2>
              </div>
              <LessonForm 
                initialData={lessons} 
                moduleId={moduleId} 
                courseId={courseId} 
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Module;