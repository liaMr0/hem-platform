import { IconBadge } from "@/components/icon-badge";
import {
  LayoutDashboard,
  ListChecks,
  FileText,
} from "lucide-react";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { ModulesForm } from "./_components/module-form";
import { TitleForm } from "./_components/title-form";
import { CourseActions } from "./_components/course-action";
import AlertBanner from "@/components/alert-banner";
import { QuizSetForm } from "./_components/quiz-set-form";
import { getCourseDetails } from "@/queries/courses";
import { SubTitleForm } from "./_components/subtitle-form";
import { replaceMongoIdInArray } from "@/lib/convertData";
import { ObjectId } from "mongodb";
import { getAllQuizSets } from "@/queries/quizzes";
import { FileUploadForm } from "./_components/file-upload";

// Definir la interfaz para los parámetros
interface PageProps {
  params: Promise<{ courseId: string }>;
}

const EditCourse = async ({ params }: PageProps) => {
  try {
    // Await para extraer el courseId de los parámetros
    const { courseId } = await params;
    
    // Validar que courseId existe
    if (!courseId) {
      throw new Error("Course ID is required");
    }
    
    const course = await getCourseDetails(courseId);

    if (!course) {
      throw new Error("Course not found");
    }

    // ✅ Función mejorada de sanitización para Next.js 15
    function sanitizeData(data: any): any {
      if (data === null || data === undefined) {
        return data;
      }
      
      if (Array.isArray(data)) {
        return data.map(item => sanitizeData(item));
      }
      
      if (typeof data === 'object') {
        if (data instanceof Date) {
          return data.toISOString();
        }
        
        if (data.constructor && data.constructor.name === 'ObjectId') {
          return data.toString();
        }
        
        if (Buffer.isBuffer(data)) {
          return data.toString('base64');
        }
        
        const sanitizedObj: any = {};
        for (const [key, value] of Object.entries(data)) {
          sanitizedObj[key] = sanitizeData(value);
        }
        return sanitizedObj;
      }
      
      return data;
    }

    const rawmodules = await replaceMongoIdInArray(course?.modules || []).sort((a: any, b: any) => a.order - b.order);
    const modules = sanitizeData(rawmodules);

    // Sanitizar los documentos también
    const documents = course?.documents ? sanitizeData(course.documents) : [];

    const allQuizSets = await getAllQuizSets(true);
    let mappedQuizSet = [];
    if (allQuizSets && allQuizSets.length > 0) {
      mappedQuizSet = allQuizSets.map((quizSet: any) => {
        return {
          value: quizSet.id,
          label: quizSet.title,
        };
      });
    }

    // ✅ Sanitizar y obtener el quizSet actual del curso
    const currentQuizSet = course?.quizSet ? sanitizeData(course.quizSet) : null;
    let currentQuizSetId = null;
    
    if (currentQuizSet) {
      // Extraer el ID del quizSet, manejando diferentes formatos
      if (typeof currentQuizSet === 'string') {
        currentQuizSetId = currentQuizSet;
      } else if (currentQuizSet._id) {
        currentQuizSetId = currentQuizSet._id.toString();
      } else if (currentQuizSet.id) {
        currentQuizSetId = currentQuizSet.id.toString();
      }
    }

    console.log('Debug QuizSet Info:', {
      currentQuizSet,
      currentQuizSetId,
      mappedQuizSet,
      courseQuizSet: course.quizSet
    });

    return (
      <>
        {!course.active && (
          <AlertBanner
            label="Este curso no está publicado. No será visible."
            variant="warning"
          />
        )}

        <div className="p-6">
          <div className="flex items-center justify-end">
            <CourseActions courseId={courseId} isActive={course?.active} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            {/* Columna izquierda - Información básica del curso */}
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Personaliza tu curso</h2>
              </div>
              
              <TitleForm
                initialData={{
                  title: course?.title,
                }}
                courseId={courseId}
              />
              
              <SubTitleForm
                initialData={{
                  subtitle: course?.subtitle,
                }}
                courseId={courseId}
              />
              
              <DescriptionForm
                initialData={{ description: course?.description }}
                courseId={courseId}
              />

              <ImageForm
                initialData={{
                  imageUrl: `/assets/images/courses/${course?.thumbnail}`,
                }}
                courseId={courseId}
              />
            </div>
            
            {/* Columna derecha - Contenido del curso */}
            <div className="space-y-6">
              {/* Sección de Módulos */}
              <div>
                <div className="flex items-center gap-x-2 mb-6">
                  <IconBadge icon={ListChecks} />
                  <h2 className="text-xl">Módulos del curso</h2>
                </div>

                <ModulesForm initialData={modules} courseId={courseId} />
              </div>

              {/* Sección de Documentos */}
              <div>
                <div className="flex items-center gap-x-2 mb-6">
                  <IconBadge icon={FileText} />
                  <h2 className="text-xl">Recursos del curso</h2>
                </div>

                <FileUploadForm
                  initialData={{
                    documents: documents,
                  }}
                  courseId={courseId}
                />
              </div>

              {/* Sección de Quiz */}
              <div>
                <QuizSetForm
                  initialData={{ 
                    quizSetId: currentQuizSetId || "" 
                  }}
                  courseId={courseId}
                  options={mappedQuizSet}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error loading course:", error);
    
    return (
      <div className="p-6">
        <AlertBanner
          label={`Error al cargar el curso: ${error.message || 'Unknown error'}`}
          variant="destructive"
        />
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            No se pudo cargar la información del curso. Por favor, verifica que el ID del curso sea válido e inténtalo de nuevo.
          </p>
        </div>
      </div>
    );
  }
};

export default EditCourse;