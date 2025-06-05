// app/dashboard/_components/skeletons/AdminDashboardSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import StatsCardSkeleton from "./StatsCardSkeleton";
import CourseStatsCardSkeleton from "./CourseStatsCardSkeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const AdminDashboardSkeleton = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Estadísticas de usuarios */}
      <div>
        <div className="flex items-center mb-4">
          <Skeleton className="h-5 w-5 mr-2 rounded" />
          <Skeleton className="h-6 w-48" />
        </div>
        <StatsCardSkeleton />
      </div>

      {/* Estadísticas de cursos */}
      <div>
        <div className="flex items-center mb-4">
          <Skeleton className="h-5 w-5 mr-2 rounded" />
          <Skeleton className="h-6 w-44" />
        </div>
        <CourseStatsCardSkeleton showInstructorCount={true} />
      </div>

      {/* Métricas adicionales */}
      <div>
        <div className="flex items-center mb-4">
          <Skeleton className="h-5 w-5 mr-2 rounded" />
          <Skeleton className="h-6 w-36" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardSkeleton;