// lib/dashboard-helper.ts
import { auth } from "@/auth";
import { Course } from "@/model/course-model";
import { User } from "@/model/user-model";
import { Module } from "@/model/module.model";
import { replaceMongoIdInArray } from "@/lib/convertData";
import mongoose from "mongoose";

// Función auxiliar para asegurar que los IDs estén presentes
function ensureIdsInData(data: any[]): any[] {
  return data.map(item => ({
    ...item,
    // Asegurar que tanto 'id' como '_id' estén presentes como strings
    id: item.id || item._id?.toString() || item._id,
    _id: item._id?.toString() || item.id,
    // Si tiene instructor, asegurar también sus IDs
    ...(item.instructor && {
      instructor: {
        ...item.instructor,
        id: item.instructor.id || item.instructor._id?.toString() || item.instructor._id,
        _id: item.instructor._id?.toString() || item.instructor.id
      }
    })
  }));
}

// Función para obtener todos los cursos (solo para admin)
export async function getAllCoursesForAdmin(): Promise<any> {
  try {
    const session = await auth();
    
    // Verificar que el usuario esté autenticado
    if (!session?.user?.email) {
      throw new Error("User not authenticated");
    }
    
    // Verificar que el usuario sea admin
    if (session.user.role !== 'admin') {
      throw new Error("Access denied: Admin role required");
    }
    
    // Obtener todos los cursos con información del instructor
    const courses = await Course.find({})
      .populate({
        path: 'instructor', 
        model: User,
        select: 'firstName lastName email profilePicture designation'
      })
      .populate({
        path: 'modules',
        model: Module,
        select: 'title'
      })
      .sort({ createdOn: -1 })
      .lean();
    
    // Procesar los datos para asegurar IDs consistentes
    const processedCourses = replaceMongoIdInArray(courses || []);
    const coursesWithIds = ensureIdsInData(processedCourses);
    
    // Debug log
    console.log('Admin courses with IDs:', coursesWithIds.map(c => ({ 
      title: c.title, 
      id: c.id, 
      _id: c._id 
    })));
    
    return coursesWithIds;
    
  } catch (error: any) {
    console.error("Error fetching all courses for admin:", error);
    throw new Error(`Failed to fetch courses: ${error.message}`);
  }
}

// Función para obtener cursos del instructor
export async function getInstructorCourses(instructorId: string): Promise<any> {
  try {
    if (!mongoose.Types.ObjectId.isValid(instructorId)) {
      throw new Error('Invalid instructor ID format');
    }

    const courses = await Course.find({ instructor: instructorId })
      .populate({
        path: 'instructor', 
        model: User,
        select: 'firstName lastName email profilePicture designation'
      })
      .populate({
        path: 'modules',
        model: Module,
        select: 'title'
      })
      .sort({ createdOn: -1 })
      .lean();
    
    // Procesar los datos para asegurar IDs consistentes
    const processedCourses = replaceMongoIdInArray(courses || []);
    const coursesWithIds = ensureIdsInData(processedCourses);
    
    // Debug log
    console.log('Instructor courses with IDs:', coursesWithIds.map(c => ({ 
      title: c.title, 
      id: c.id, 
      _id: c._id 
    })));
    
    return coursesWithIds;
    
  } catch (error: any) {
    console.error("Error fetching instructor courses:", error);
    throw new Error(`Failed to fetch instructor courses: ${error.message}`);
  }
}

// Función unificada para obtener cursos basado en el rol
export async function getCoursesByRole(): Promise<any> {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      throw new Error("User not authenticated");
    }
    
    const userRole = session.user.role;
    const userId = session.user.id;
    
    console.log('Getting courses for role:', userRole, 'userId:', userId);
    
    // Si es admin, obtener todos los cursos
    if (userRole === 'admin') {
      return await getAllCoursesForAdmin();
    }
    
    // Si es instructor, obtener solo sus cursos
    if (userRole === 'instructor') {
      if (!userId) {
        throw new Error("Instructor ID not found in session");
      }
      return await getInstructorCourses(userId);
    }
    
    // Si no tiene rol válido, retornar array vacío
    throw new Error("Invalid user role or insufficient permissions");
    
  } catch (error: any) {
    console.error("Error fetching courses by role:", error);
    throw new Error(`Failed to fetch courses: ${error.message}`);
  }
}

// Función para obtener estadísticas del dashboard
export async function getDashboardStats(userRole: string, instructorId?: string) {
  try {
    let courses: any[] = [];
    
    if (userRole === 'admin') {
      courses = await getAllCoursesForAdmin();
    } else if (userRole === 'instructor' && instructorId) {
      courses = await getInstructorCourses(instructorId);
    }
    
    const stats = {
      totalCourses: courses.length,
      activeCourses: courses.filter(course => course.active).length,
      draftCourses: courses.filter(course => !course.active).length,
      totalInstructors: userRole === 'admin' 
        ? new Set(courses.map(course => course.instructor?.id || course.instructor?._id).filter(Boolean)).size
        : 1,
      totalModules: courses.reduce((sum, course) => sum + (course.modules?.length || 0), 0),
      totalLearningObjectives: courses.reduce((sum, course) => sum + (course.learning?.length || 0), 0),
      coursesThisMonth: courses.filter(course => {
        const courseDate = new Date(course.createdOn);
        const now = new Date();
        const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return courseDate >= firstDayThisMonth;
      }).length
    };
    
    return stats;
  } catch (error: any) {
    console.error("Error getting dashboard stats:", error);
    return {
      totalCourses: 0,
      activeCourses: 0,
      draftCourses: 0,
      totalInstructors: 0,
      totalModules: 0,
      totalLearningObjectives: 0,
      coursesThisMonth: 0
    };
  }
}