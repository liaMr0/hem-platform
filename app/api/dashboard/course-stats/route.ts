// app/api/dashboard/course-stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getCoursesByRole } from '@/lib/dashboard-helper';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const userRole = session.user.role;

    if (userRole !== 'admin' && userRole !== 'instructor') {
      return NextResponse.json(
        { error: 'Permisos insuficientes' },
        { status: 403 }
      );
    }

    // Obtener cursos según el rol
    const courses = await getCoursesByRole();

    // Calcular estadísticas
    const totalCourses = courses.length;
    const activeCourses = courses.filter((course: any) => course.active).length;
    const draftCourses = totalCourses - activeCourses;

    // Contar instructores únicos (solo para admin)
    let uniqueInstructors = 0;
    if (userRole === 'admin') {
      const instructorIds = new Set(
        courses.map((course: any) => course.instructor?._id || course.instructor?.id)
          .filter(Boolean)
      );
      uniqueInstructors = instructorIds.size;
    }

    // Calcular cursos recientes (últimos 30 días)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentCourses = courses.filter((course: any) => {
      const createdAt = new Date(course.createdAt);
      return createdAt >= thirtyDaysAgo;
    }).length;

    const stats = {
      totalCourses,
      activeCourses,
      draftCourses,
      uniqueInstructors,
      recentCourses,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching course stats:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}