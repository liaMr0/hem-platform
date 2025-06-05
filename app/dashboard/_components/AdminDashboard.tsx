// app/dashboard/_components/AdminDashboard.tsx
import { StatsCards } from "../users/_components/StatsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BookOpen, Users, Activity } from "lucide-react";
import { CourseStatsCards } from "./CourseStatsCards";

export const AdminDashboard = ({ userStats, courseStats }: { 
  userStats: any; 
  courseStats: any; 
}) => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
        <p className="text-muted-foreground">
          Vista general de la plataforma educativa
        </p>
      </div>

      {/* Estadísticas de usuarios */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Estadísticas de Usuarios
        </h2>
        <StatsCards stats={userStats} />
      </div>

      {/* Estadísticas de cursos */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          Estadísticas de Cursos
        </h2>
        <CourseStatsCards stats={courseStats} showInstructorCount={true} />
      </div>

      {/* Métricas adicionales para admin */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Métricas Generales
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Actividad</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {courseStats ? Math.round((courseStats.activeCourses / courseStats.totalCourses) * 100) : 0}%
              </div>
              <div className="text-xs text-muted-foreground">
                Cursos activos vs totales
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio por Instructor</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {courseStats && courseStats.uniqueInstructors > 0 
                  ? Math.round(courseStats.totalCourses / courseStats.uniqueInstructors)
                  : 0
                }
              </div>
              <div className="text-xs text-muted-foreground">
                Cursos por instructor
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Crecimiento</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {courseStats?.recentCourses || 0}
              </div>
              <div className="text-xs text-muted-foreground">
                Cursos creados (últimos 30 días)
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};