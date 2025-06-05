// app/dashboard/_components/skeletons/EmptyStateSkeleton.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const EmptyStateSkeleton = () => {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Skeleton className="h-12 w-12 rounded-full mb-4" />
        <Skeleton className="h-6 w-64 mb-2" />
        <Skeleton className="h-4 w-96 mb-6" />
        <Skeleton className="h-10 w-48 rounded-md" />
      </CardContent>
    </Card>
  );
};

export default EmptyStateSkeleton;
