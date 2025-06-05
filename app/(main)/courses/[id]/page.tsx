// app/courses/[id]/page.tsx (Mejorado)
import { getCourseDetails } from "@/queries/courses";
import { replaceMongoIdInArray } from "@/lib/convertData";
import CourseDetailsIntro from "./_components/CourseDetailsIntro";
import Testimonials from "./_components/Testimonials";
import CourseCurriculum from "./_components/CourseCurriculum";

const SingleCoursePage = async ({ params }: any) => {
  const { id } = await params;
  const course = await getCourseDetails(id);

  return (
    <div className="min-h-screen bg-gray-50">
      <CourseDetailsIntro course={course} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Main Content */}
          <div className="space-y-8">
            <CourseCurriculum course={course} />
            
            {/* Solo mostrar testimonios si existen */}
            {course?.testimonials && course.testimonials.length > 0 && (
              <Testimonials testimonials={replaceMongoIdInArray(course.testimonials)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCoursePage;