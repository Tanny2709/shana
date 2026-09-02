interface Props {
  bestFor: string[];
  goodToKnow: string[];
  considerAlternativesIf: string[];
}

export function BestForSection({ bestFor, goodToKnow, considerAlternativesIf }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {bestFor.length > 0 && (
        <div className="rounded-lg border border-border bg-bg-elevated p-4">
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-fg-subtle">Best for</h3>
          <ul className="flex flex-col gap-1.5">
            {bestFor.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-fg">
                <span className="mt-0.5 text-success">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {goodToKnow.length > 0 && (
        <div className="rounded-lg border border-border bg-bg-elevated p-4">
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-fg-subtle">Good to know</h3>
          <ul className="flex flex-col gap-1.5">
            {goodToKnow.map((item) => (
              <li key={item} className="text-sm text-fg-muted">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {considerAlternativesIf.length > 0 && (
        <div className="rounded-lg border border-border bg-bg-elevated p-4 sm:col-span-2">
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-fg-subtle">
            Consider alternatives if
          </h3>
          <ul className="flex flex-col gap-1.5">
            {considerAlternativesIf.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-fg-muted">
                <span className="mt-0.5 text-fg-subtle">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
