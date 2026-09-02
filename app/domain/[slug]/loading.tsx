import { SkeletonGrid } from "@/components/skeleton-card";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-8">
        <div className="h-7 w-40 animate-pulse rounded bg-bg-hover" />
        <div className="mt-1 h-4 w-64 animate-pulse rounded bg-bg-hover" />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[200px_1fr]">
        <div className="hidden h-64 animate-pulse rounded-lg border border-border bg-bg-elevated lg:block" />
        <div>
          <div className="mb-4 h-4 w-16 animate-pulse rounded bg-bg-hover" />
          <SkeletonGrid />
        </div>
      </div>
    </main>
  );
}
