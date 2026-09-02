import { SkeletonGrid } from "@/components/skeleton-card";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="h-7 w-56 animate-pulse rounded bg-bg-hover" />
      <div className="mt-1 h-4 w-72 animate-pulse rounded bg-bg-hover" />
      <div className="mt-6 h-9 animate-pulse rounded-lg border border-border bg-bg-elevated" />
      <div className="mt-4 h-24 animate-pulse rounded-lg border border-border bg-bg-elevated" />
      <div className="mt-6 mb-4 h-4 w-20 animate-pulse rounded bg-bg-hover" />
      <SkeletonGrid count={9} />
    </main>
  );
}
