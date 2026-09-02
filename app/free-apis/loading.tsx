import { SkeletonGrid } from "@/components/skeleton-card";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto h-8 w-96 animate-pulse rounded bg-bg-hover" />
        <div className="mx-auto mt-3 h-4 w-80 animate-pulse rounded bg-bg-hover" />
      </div>
      <div className="mx-auto mt-8 h-32 max-w-3xl animate-pulse rounded-lg border border-border bg-bg-elevated" />
      <div className="mt-12">
        <div className="mb-4 h-5 w-48 animate-pulse rounded bg-bg-hover" />
        <SkeletonGrid />
      </div>
    </main>
  );
}
