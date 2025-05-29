
import { IconBadge } from "@/components/icon-badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LayoutDashboard } from "lucide-react";
import { Video } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LessonTitleForm } from "./lesson-title-form";
import { LessonDescriptionForm } from "./lesson-description-form";
import { VideoUrlForm } from "./video-url-form";
import { LessonActions } from "./lesson-action";

interface LessonModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  courseId: string;
  lesson: any;
  moduleId: string;
  onUpdate?: (lessonId: string, newActiveState: boolean) => void;
  onDelete?: () => void;
}

export const LessonModal = ({ 
  open, 
  setOpen, 
  courseId, 
  lesson, 
  moduleId,
  onUpdate,
  onDelete 
}: LessonModalProps) => {

  function handleDelete() {
    setOpen(false);
    if (onDelete) {
      onDelete();
    }
  }

  function handleUpdate(lessonId: string, newActiveState: boolean) {
    if (onUpdate) {
      onUpdate(lessonId, newActiveState);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[1200px] w-[96%] overflow-y-auto max-h-[90vh]"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Editor de Lección</DialogTitle>
          <DialogDescription>
            Personaliza y administra la configuración de esta lección.
          </DialogDescription>
        </DialogHeader>

        <div>
          <div className="flex items-center justify-between">
            <div className="w-full">
              <Link
                href={`/dashboard/courses/${courseId}`}
                className="flex items-center text-sm hover:opacity-75 transition mb-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a la configuración del curso.
              </Link>
              <div className="flex items-center justify-end">
                <LessonActions 
                  lesson={lesson} 
                  moduleId={moduleId} 
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={LayoutDashboard} />
                  <h2 className="text-xl">Personaliza tu lección</h2>
                </div>
                <LessonTitleForm
                  initialData={{ title: lesson?.title }}
                  courseId={courseId}
                  lessonId={lesson?.id}
                />
                <LessonDescriptionForm
                  initialData={{ description: lesson?.description }}
                  courseId={courseId}
                  lessonId={lesson?.id}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Video} />
                <h2 className="text-xl">Agregar video</h2>
              </div>
              <VideoUrlForm
                initialData={{
                  url: lesson?.video_url,
                  duration: lesson?.duration
                }}
                courseId={courseId}
                lessonId={lesson?.id}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};