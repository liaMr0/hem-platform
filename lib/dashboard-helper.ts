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

export function populateEnrollmentData(enrollments: any[]) {
  return enrollments.map(enrollment => ({
    id: enrollment._id?.toString() || enrollment.id,
    studentId: enrollment.student?._id?.toString() || enrollment.studentId,
    studentName: enrollment.student 
      ? `${enrollment.student.firstName || ''} ${enrollment.student.lastName || ''}`.trim()
      : 'Usuario no encontrado',
    studentEmail: enrollment.student?.email || 'Email no disponible',
    courseId: enrollment.course?._id?.toString() || enrollment.courseId,
    courseName: enrollment.course?.title || 'Curso no encontrado', 
    enrollmentDate: enrollment.enrollment_date || enrollment.createdAt,
    progress: enrollment.progress || 0,
    status: enrollment.status || 'active'
  }));
}
