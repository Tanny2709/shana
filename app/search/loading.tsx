import { SkeletonGrid } from "@/components/skeleton-card";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-xl">
        <div className="h-12 animate-pulse rounded-lg border border-border bg-bg-elevated" />
      </div>
      <div className="mt-8">
        <div className="mb-4 h-4 w-32 animate-pulse rounded bg-bg-hover" />
        <SkeletonGrid />
      </div>
    </main>
  );
}
