import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const CategoryCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="w-full space-y-2">
            <Skeleton className="h-5 w-24 mx-auto" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

