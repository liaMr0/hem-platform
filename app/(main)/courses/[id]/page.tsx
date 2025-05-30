import CourseDetailsIntro from "./_components/CourseDetailsIntro";
import CourseDetails from "./_components/CourseDetails";
import Testimonials from "./_components/Testimonials";
import { getCourseDetails } from "@/queries/courses";
import { replaceMongoIdInArray } from "@/lib/convertData";
 
const SingleCoursePage = async ({ params}:any) => {
    const { id } = await params;
    const course = await getCourseDetails(id);
    const currentCourseId = course.id.toString();
    console.log(course);
    console.log(currentCourseId);
    
  return (
    <>
      <CourseDetailsIntro course={course} />

      <CourseDetails course={course} />
    {
      course?.testimonials && <Testimonials testimonials={replaceMongoIdInArray(course?.testimonials)} />   
    }

   
    </>
  );
};
export default SingleCoursePage;
