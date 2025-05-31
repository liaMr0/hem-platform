// app/courses/[id]/page.tsx

import { getCourseDetails } from "@/queries/courses";
import { replaceMongoIdInArray } from "@/lib/convertData";
import CourseDetailsIntro from "./_components/CourseDetailsIntro";
import { CourseOverview } from "./_components/CourseOverview";
import Testimonials from "./_components/Testimonials";
import CourseInstructor from "./_components/CourseInstructor";
import { CourseStats } from "./_components/CourseStats";
import { CourseRequirements } from "./_components/CourseRequirements";
import CourseCurriculum from "./_components/CourseCurriculum";

const SingleCoursePage = async ({ params }: any) => {
  const { id } = await params;
  const course = await getCourseDetails(id);
  const currentCourseId = course.id.toString();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <CourseDetailsIntro course={course} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 ">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Overview */}
          
            {/* Course Curriculum */}
            <CourseCurriculum course={course} />

            {/* Testimonials */}
            {course?.testimonials && (
              <Testimonials testimonials={replaceMongoIdInArray(course?.testimonials)} />
            )}
          </div>

        
        </div>
      </div>
    </div>
  );
};

export default SingleCoursePage;
