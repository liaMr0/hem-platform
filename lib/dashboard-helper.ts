import { auth } from "@/auth";
import { getCourseDetails, getCourseDetailsByInstructor } from "@/queries/courses";
import { getReport } from "@/queries/reports";
import { getUserByEmail, getUserDetails } from "@/queries/users";
import mongoose from "mongoose";

export const COURSE_DATA = "course";
export const ENROLLMENT_DATA = "enrollment";
export const REVIEW_DATA = "review";

// Define types for our data structures
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  id?: string;
}

interface Course {
  _id: string;
  modules: any[];
}

interface Review {
  user?: {
    _id: string;
  };
  studentName?: string;
}

interface Enrollment {
  student?: {
    _id: string;
  };
  course?: {
    _id: string;
  };
  studentName?: string;
  studentEmail?: string;
  progress?: number;
  quizMark?: number;
}

interface Report {
  totalCompletedModeules?: any[];
  quizAssessment?: {
    assessments: Array<{
      attempted: boolean;
      options: Array<{
        isCorrect: boolean;
        isSelected: boolean;
      }>;
    }>;
  };
}

// Adjusted interface to handle both data structures returned by getCourseDetailsByInstructor
interface InstructorDashboardData {
  // First possible return type
  courses?: mongoose.FlattenMaps<any>[] | number;
  enrollments?: any[] | any;
  reviews?: any[] | number;
  
  // Second possible return type
  ratings?: string;
  inscourses?: mongoose.FlattenMaps<any>[];
  revenue?: number;
  fullInsName?: string;
  Designation?: any;
  insImage?: any;
}

const populateReviewData = async (reviews: Review[]): Promise<Review[]> => {
  const populatedReviews = await Promise.all(
    reviews.map(async (review) => {
      // Add null check for the _id
      if (review?.user?._id) {
        const student = await getUserDetails(review.user._id);
        if (student?.firstName && student?.lastName) {
          review["studentName"] = `${student.firstName} ${student.lastName}`;
        }
      }
      return review;
    })
  );
  return populatedReviews;
};

export async function getInstructorDashboardData(dataType: string): Promise<any> {
  try {
    const session = await auth();
    const email = session?.user?.email;
    
    // Add null check for email
    if (!email) {
      throw new Error("User email not found in session");
    }
    
    const instructor = await getUserByEmail(email);
    
    // Add null check for instructor id
    if (!instructor?.id) {
      throw new Error("Instructor ID not found");
    }
    
    const data: InstructorDashboardData = await getCourseDetailsByInstructor(instructor.id, true);

    switch (dataType) {
      case COURSE_DATA:
        // Handle both array and number cases
        return Array.isArray(data?.courses) ? data.courses : [];
      case REVIEW_DATA:
        // Handle both array and number cases
        return Array.isArray(data?.reviews) 
          ? populateReviewData(data.reviews) 
          : [];
      case ENROLLMENT_DATA:
        // Handle potential non-array data
        return Array.isArray(data?.enrollments) 
          ? populateEnrollmentData(data.enrollments) 
          : [];
      default:
        return data;
    }
  } catch (error: any) {
    throw new Error(error);
  }
}

const populateEnrollmentData = async (enrollments: Enrollment[]): Promise<Enrollment[]> => {
  const populatedEnrollments = await Promise.all(
    enrollments.map(async (enrollment) => {
      // Add null checks for all potential undefined values
      if (enrollment?.student?._id) {
        // Update student information
        const student = await getUserDetails(enrollment.student._id);
        if (student?.firstName && student?.lastName) {
          enrollment["studentName"] = `${student.firstName} ${student.lastName}`;
        }
        if (student?.email) {
          enrollment["studentEmail"] = student.email;
        }

        // Update quiz and Progress info
        const filter = {
          course: enrollment?.course?._id,
          student: enrollment.student._id,
        };

        // Only proceed if we have both course and student ids
        if (enrollment?.course?._id) {
          const report: Report | null = await getReport(filter);
          enrollment["progress"] = 0;
          enrollment["quizMark"] = 0;

          if (report) {
            // Calculate Progress
            const course: Course = await getCourseDetails(enrollment.course._id);
            if (course?.modules) {
              const totalModules = course.modules.length;
              const totalCompletedModules = report?.totalCompletedModeules?.length || 0;
              const progress = (totalCompletedModules / totalModules) * 100;
              enrollment["progress"] = progress;

              /// Calculate Quiz Marks
              if (report?.quizAssessment?.assessments) {
                const quizzes = report.quizAssessment.assessments;
                const quizzesTaken = quizzes.filter(q => q.attempted);
                // find how many quizzes answered correct
                const totalCorrect = quizzesTaken
                  .map(quiz => {
                    const item = quiz.options;
                    return item.filter(o => {
                      return o.isCorrect === true && o.isSelected === true;
                    });
                  })
                  .filter(elem => elem.length > 0)
                  .flat();
                const marksFromQuizzes = totalCorrect.length * 5;
                enrollment["quizMark"] = marksFromQuizzes;
              }
            }
          }
        }
      }
      return enrollment;
    })
  );
  return populatedEnrollments;
};