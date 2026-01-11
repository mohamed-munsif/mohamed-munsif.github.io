import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export function SkeletonDemo() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
      <div className="space-y-2 flex-1 min-w-0">
        <Skeleton className="h-4 w-full max-w-[250px]" />
        <Skeleton className="h-4 w-full max-w-[200px]" />
      </div>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3 w-full">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}

export { Skeleton }
