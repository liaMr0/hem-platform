// import { getCourseDetails } from "@/queries/courses";
// import { columns } from "./_components/columns";
// import { DataTable } from "./_components/data-table";
// import { ObjectId } from "mongoose";
 
// const ReviewsPage = async ({ params }) => {
//   const { courseId } = await params;
//   const course = await getCourseDetails(courseId);
//   const rawReviewData = await getInstructorDashboardData(REVIEW_DATA);
//   //console.log(rawReviewData);

//   const reviewData = sanitizeData(rawReviewData)

//   const reviewDataForCourse = reviewData.filter((review) => review?.courseId?.toString() === courseId)



//   return (
//     <div className="p-6">
//       <h2 className="text-3xl text-gray-700 font-bold" >{course?.title}</h2>
//       <DataTable columns={columns} data={reviewDataForCourse} />
//     </div>
//   );
// };

// // Sanitize fucntion for handle ObjectID and Buffer
// function sanitizeData(data) {
//   return JSON.parse(
//     JSON.stringify(data, (key, value) => {
//       if (value instanceof ObjectId) {
//           return value.toString();
//       }
//       if (Buffer.isBuffer(value)) {
//         return value.toString("base64")
//       }
//       return value;
//     })
//   );
// }

// export default ReviewsPage;
