const POINTS = [
  {
    title: "Deterministic scoring",
    body: "Directory Score is computed from real, disclosed fields — documentation, pricing, free tier, maturity — never an ML model or a paid ranking.",
  },
  {
    title: "Freshness tracked per API",
    body: "Every listing shows when it was last verified, so you know how current the pricing and limits are before you rely on them.",
  },
  {
    title: "Outdated data is reportable",
    body: "Found something stale or wrong? Every API page has a direct way to flag it — data quality is a standing process, not a one-time import.",
  },
] as const;

export function TrustSection() {
  return (
    <div>
      <div className="mx-auto max-w-lg text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-fg-subtle">How this stays accurate</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          Data you can actually check.
        </h2>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {POINTS.map((p) => (
          <div key={p.title} className="rounded-xl border border-border bg-bg-elevated p-6">
            <h3 className="text-sm font-medium text-fg">{p.title}</h3>
            <p className="mt-2 text-sm text-fg-muted">{p.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
