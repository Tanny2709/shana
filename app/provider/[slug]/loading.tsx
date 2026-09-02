import { SkeletonGrid } from "@/components/skeleton-card";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="flex items-start gap-4 border-b border-border pb-8">
        <div className="h-12 w-12 animate-pulse rounded-md bg-bg-hover" />
        <div className="flex-1">
          <div className="h-6 w-40 animate-pulse rounded bg-bg-hover" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-bg-hover" />
        </div>
      </div>
      <div className="mt-10">
        <div className="mb-4 h-4 w-32 animate-pulse rounded bg-bg-hover" />
        <SkeletonGrid />
      </div>
    </main>
  );
}
