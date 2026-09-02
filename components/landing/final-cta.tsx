import Link from "next/link";

export function FinalCTA() {
  return (
    <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-bg-elevated px-6 py-16 text-center">
      <h2 className="max-w-lg text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
        The next API you&rsquo;ll use is probably already here.
      </h2>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/browse"
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
        >
          Explore the API Directory →
        </Link>
        <Link
          href="/contribute"
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
        >
          Contribute an API
        </Link>
      </div>
    </div>
  );
}
