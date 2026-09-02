import { SkeletonGrid } from "@/components/skeleton-card";

// Shown instantly on navigation to "/" while the real page's Server
// Component data (getDomains/getStats/getBestFreeApis/intentSearch) is
// still loading — a real Next.js Suspense boundary (app/loading.tsx), not
// a client-side spinner. Roughly traces the real landing page's shape so
// nothing jumps when the real content swaps in.
export default function Loading() {
  return (
    <main className="flex-1">
      <div className="relative overflow-hidden">
        <div className="relative mx-auto max-w-2xl px-4 py-24 text-center sm:py-32">
          <div className="mx-auto h-3 w-40 animate-pulse rounded bg-bg-hover" />
          <div className="mx-auto mt-5 h-9 w-full max-w-xl animate-pulse rounded bg-bg-hover" />
          <div className="mx-auto mt-3 h-9 w-4/5 max-w-lg animate-pulse rounded bg-bg-hover" />
          <div className="mx-auto mt-6 h-4 w-full max-w-md animate-pulse rounded bg-bg-hover" />
          <div className="mx-auto mt-2 h-4 w-2/3 max-w-sm animate-pulse rounded bg-bg-hover" />

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <div className="h-10 w-52 animate-pulse rounded-md bg-bg-hover" />
            <div className="h-10 w-44 animate-pulse rounded-md border border-border" />
          </div>

          <div className="mx-auto mt-10 h-64 w-full max-w-xl animate-pulse rounded-xl border border-border bg-bg-elevated" />

          <div className="mx-auto mt-8 h-3 w-56 animate-pulse rounded bg-bg-hover" />
        </div>
      </div>

      <section className="mx-auto mt-24 w-full max-w-4xl px-4 sm:px-6">
        <div className="mx-auto h-6 w-80 max-w-full animate-pulse rounded bg-bg-hover" />
        <div className="mx-auto mt-4 h-4 w-2/3 animate-pulse rounded bg-bg-hover" />
        <div className="mx-auto mt-10 h-10 w-full max-w-2xl animate-pulse rounded-full bg-bg-hover" />
      </section>

      <section className="mx-auto mt-24 w-full max-w-5xl px-4 sm:px-6">
        <div className="mx-auto h-6 w-72 max-w-full animate-pulse rounded bg-bg-hover" />
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl border border-border bg-bg-elevated" />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 w-full max-w-5xl px-4 sm:px-6">
        <div className="mx-auto h-4 w-40 animate-pulse rounded bg-bg-hover" />
        <div className="mt-10">
          <SkeletonGrid count={4} />
        </div>
      </section>
    </main>
  );
}
