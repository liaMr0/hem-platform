import { IconBadge } from "@/components/icon-badge";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { CategoryForm } from "./_components/category-form";
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
 
const EditCourse = async ({ params: {courseId} }:any) => {
 
  const course = await getCourseDetails(courseId);

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

  const rawmodules = await replaceMongoIdInArray(course?.modules).sort((a:any,b:any) => a.order - b.order);
  const modules = sanitizeData(rawmodules);

  // Sanitizar los documentos también
  const documents = course?.documents ? sanitizeData(course.documents) : [];

  const allQuizSets = await getAllQuizSets(true);
  let mappedQuizSet = [];
  if (allQuizSets && allQuizSets.length > 0) {
    mappedQuizSet = allQuizSets.map((quizSet:any) => {
      return {
        value: quizSet.id,
        label: quizSet.title,
      }
    })
  }

  return (
    <> 
    {
      !course.active && <AlertBanner
        label="This course is unpublished. It will not be visible in the course."
        variant="warning"
      />
    }
      
      <div className="p-6">
        <div className="flex items-center justify-end">
          <CourseActions courseId={courseId} isActive={course?.active} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
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
            <DescriptionForm initialData={{description: course?.description }} courseId={courseId} />

            <ImageForm initialData={{imageUrl: `/assets/images/courses/${course?.thumbnail}`}} courseId={courseId} />
            
            {/* Componente actualizado para subida de múltiples archivos */}
            <FileUploadForm 
              initialData={{
                documents: documents
              }} 
              courseId={courseId} 
            />
            
            <QuizSetForm initialData={{ quizSetId: course?.quizSet?._id.toString() }} courseId={courseId} options={mappedQuizSet} />
          </div>
          <div className="space-y-6">
            <div> 
              <div className="flex items-center gap-x-2 mb-6">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course Modules</h2>
              </div>

              <ModulesForm initialData={modules} courseId={courseId} /> 
            </div>
           
          </div>
        </div>
      </div>
    </>
  );
};
export default EditCourse;