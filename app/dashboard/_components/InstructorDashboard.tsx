// app/dashboard/_components/InstructorDashboard.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Plus, BarChart3, Target } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CourseStatsCards } from "./CourseStatsCards";

export const InstructorDashboard = ({ courseStats }: { courseStats: any }) => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Panel del Instructor</h1>
        <p className="text-muted-foreground">
          Gestiona tus cursos y contenido educativo
        </p>
      </div>

      {/* Estadísticas de cursos del instructor */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Mis Estadísticas
        </h2>
        <CourseStatsCards stats={courseStats} showInstructorCount={false} />
      </div>

      {/* Acciones rápidas */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Mis Cursos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">Gestiona y edita tus cursos existentes</p>
              <Link href="/dashboard/courses">
                <Button className="w-full">
                  Ver Cursos
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Crear Curso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">Crea un nuevo curso desde cero</p>
              <Link href="/dashboard/courses/add">
                <Button variant="outline" className="w-full">
                  Crear Curso
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Cuestionarios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">Gestiona tus cuestionarios y evaluaciones</p>
              <Link href="/dashboard/quiz-sets">
                <Button variant="secondary" className="w-full">
                  Ver Cuestionarios
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mensaje motivacional si no hay cursos */}
      {courseStats && courseStats.totalCourses === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">¡Comienza tu viaje como instructor!</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Aún no has creado ningún curso. Comparte tu conocimiento y ayuda a otros a aprender.
            </p>
            <Link href="/dashboard/courses/add">
              <Button size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Crear Mi Primer Curso
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
