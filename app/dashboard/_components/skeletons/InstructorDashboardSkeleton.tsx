// app/dashboard/_components/skeletons/InstructorDashboardSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import CourseStatsCardSkeleton from "./CourseStatsCardSkeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const InstructorDashboardSkeleton = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-9 w-56 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>

      {/* Estadísticas de cursos del instructor */}
      <div>
        <div className="flex items-center mb-4">
          <Skeleton className="h-5 w-5 mr-2 rounded" />
          <Skeleton className="h-6 w-40" />
        </div>
        <CourseStatsCardSkeleton showInstructorCount={false} />
      </div>

      {/* Acciones rápidas */}
      <div>
        <div className="flex items-center mb-4">
          <Skeleton className="h-5 w-5 mr-2 rounded" />
          <Skeleton className="h-6 w-36" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center">
                  <Skeleton className="h-5 w-5 mr-2 rounded" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-full rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboardSkeleton;