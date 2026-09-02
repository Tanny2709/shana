// Matches <ApiCard />'s rough shape/dimensions so the layout doesn't jump
// when real content replaces it. Shown via Next.js's loading.tsx
// convention (a real Suspense boundary, not a client-side spinner) while a
// route's server data is being fetched.
export function SkeletonCard() {
  return (
    <div className="flex animate-pulse flex-col gap-3 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-bg-hover" />
          <div className="flex flex-col gap-1.5">
            <div className="h-3.5 w-24 rounded bg-bg-hover" />
            <div className="h-3 w-16 rounded bg-bg-hover" />
          </div>
        </div>
        <div className="h-4 w-4 rounded bg-bg-hover" />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="h-3 w-full rounded bg-bg-hover" />
        <div className="h-3 w-2/3 rounded bg-bg-hover" />
      </div>
      <div className="flex gap-1.5">
        <div className="h-5 w-14 rounded bg-bg-hover" />
        <div className="h-5 w-16 rounded bg-bg-hover" />
        <div className="h-5 w-14 rounded bg-bg-hover" />
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="h-3 w-20 rounded bg-bg-hover" />
        <div className="h-3 w-8 rounded bg-bg-hover" />
      </div>
      <div className="flex items-center justify-between border-t border-border pt-3">
        <div className="h-3 w-16 rounded bg-bg-hover" />
        <div className="h-3 w-14 rounded bg-bg-hover" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
