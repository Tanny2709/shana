export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <div className="h-4 w-20 animate-pulse rounded bg-bg-hover" />
      <div className="mt-3 flex items-start gap-4 border-b border-border pb-8">
        <div className="h-12 w-12 animate-pulse rounded-md bg-bg-hover" />
        <div className="flex-1">
          <div className="h-6 w-56 animate-pulse rounded bg-bg-hover" />
          <div className="mt-2 h-4 w-40 animate-pulse rounded bg-bg-hover" />
          <div className="mt-2 h-4 w-80 animate-pulse rounded bg-bg-hover" />
        </div>
      </div>
      <div className="mt-8 h-20 animate-pulse rounded-lg border border-border bg-bg-elevated" />
      <div className="mt-8 h-32 animate-pulse rounded-lg border border-border bg-bg-elevated" />
      <div className="mt-8 h-40 animate-pulse rounded-lg border border-border bg-bg-elevated" />
    </main>
  );
}
