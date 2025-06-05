// app/dashboard/_components/CourseStatsCards.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react";

interface CourseStatsCardsProps {
  stats: {
    totalCourses: number;
    activeCourses: number;
    draftCourses: number;
    uniqueInstructors?: number;
    recentCourses?: number;
  } | null;
  showInstructorCount?: boolean;
}

export function CourseStatsCards({ stats, showInstructorCount = false }: CourseStatsCardsProps) {
  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cursos</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCourses}</div>
          <div className="text-xs text-muted-foreground mt-1">
            En toda la plataforma
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cursos Activos</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.activeCourses}</div>
          <div className="text-xs text-muted-foreground">
            Publicados y disponibles
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Borradores</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.draftCourses}</div>
          <div className="text-xs text-muted-foreground">
            En desarrollo
          </div>
        </CardContent>
      </Card>

      {showInstructorCount ? (
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Instructores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueInstructors || 0}</div>
            <div className="text-xs text-muted-foreground">
              Creadores de contenido
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recientes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentCourses || 0}</div>
            <div className="text-xs text-muted-foreground">
              Últimos 30 días
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
