import { Skeleton } from "@/components/ui/skeleton";

export default function SectionLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}
