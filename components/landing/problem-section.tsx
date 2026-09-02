const STEPS = ["Docs", "Pricing page", "Signup form", "Rate limits", "A search engine", "A forum thread", "Another API"];

export function ProblemSection() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-medium uppercase tracking-widest text-fg-subtle">The problem</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
        Finding an API shouldn&rsquo;t take an afternoon.
      </h2>
      <p className="mx-auto mt-4 max-w-lg text-sm text-fg-muted">
        Developers jump between documentation, pricing pages, signup flows, and comparison
        tables just to answer basic questions — does it have a free tier, how much does it cost,
        how do I authenticate, is it right for this, what else is out there.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-3">
        {STEPS.map((step, i) => (
          <span key={step} className="flex items-center gap-2">
            <span className="rounded-full border border-border px-3 py-1.5 text-xs text-fg-subtle">
              {step}
            </span>
            {i < STEPS.length - 1 && <span className="text-fg-subtle">→</span>}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm">
        <span className="text-fg-subtle">becomes</span>
        <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 font-medium text-accent">
          API Directory — one place to evaluate them
        </span>
      </div>
    </div>
  );
}
