import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ProductCardSkeleton = () => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative overflow-hidden bg-muted">
        <Skeleton className="w-full h-48" />
      </div>

      <CardContent className="flex-1 p-4">
        <Skeleton className="h-3 w-16 mb-2" />
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-4 w-24 mb-4" />
        <Skeleton className="h-6 w-32" />
      </CardContent>

      <CardFooter className="p-4 pt-0 space-y-2">
        <div className="flex gap-2 w-full">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
};

