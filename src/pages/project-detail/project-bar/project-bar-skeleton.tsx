import { Skeleton } from "@/components/ui/skeleton";

function ProjectBarSkeleton() {
  return (
    <div className="h-project-bar-height bg-white/10 backdrop-blur-md border-b border-white/20 px-5 flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-8 w-24" />
      </div>

      <div className="flex gap-1 items-center">
        <div className="flex -space-x-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-8 rounded-full border-2 border-background" />
          ))}
        </div>

        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-9 rounded-md" />
        ))}

        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}

export default ProjectBarSkeleton;
