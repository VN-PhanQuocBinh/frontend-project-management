import { Skeleton } from "@/components/ui/skeleton";

interface ListColumnsSkeletonProps {
  columnsCount?: number;
}

function ColumnSkeleton() {
  return (
    <div className="min-w-68 max-w-68 ml-2 pr-1 rounded-md h-fit bg-column">
      <div className="p-2 flex items-center justify-between min-h-8">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>

      <div className="flex flex-col gap-2 overflow-x-hidden overflow-y-auto max-h-110 pt-0 pr-1 pb-2 pl-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-lg bg-white p-3">
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>

      <div className="p-2 min-h-8 flex items-center justify-between">
        <Skeleton className="h-8 w-30" />
        <Skeleton className="h-5 w-5" />
      </div>
    </div>
  );
}

function ListColumnsSkeleton({ columnsCount = 4 }: ListColumnsSkeletonProps) {
  return (
    <div className="w-full h-full flex overflow-x-auto overflow-y-hidden py-2">
      {Array.from({ length: columnsCount }).map((_, index) => (
        <ColumnSkeleton key={index} />
      ))}

      <div className="w-60 min-w-60 mx-2 h-fit">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export default ListColumnsSkeleton;
