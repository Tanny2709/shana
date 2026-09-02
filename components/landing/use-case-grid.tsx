import Link from "next/link";

interface DomainItem {
  slug: string;
  name: string;
  description: string | null;
  count: number;
}

export function UseCaseGrid({ domains }: { domains: DomainItem[] }) {
  return (
    <div>
      <div className="mx-auto max-w-lg text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-fg-subtle">
          Start with what you&rsquo;re building
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          Find APIs by what you&rsquo;re building.
        </h2>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {domains.map((d) => (
          <Link
            key={d.slug}
            href={`/domain/${d.slug}`}
            className="group flex flex-col justify-between gap-6 rounded-xl border border-border bg-bg-elevated p-6 transition-colors hover:border-border-strong"
          >
            <div>
              <h3 className="text-base font-medium text-fg">{d.name}</h3>
              {d.description && <p className="mt-1.5 text-sm text-fg-muted">{d.description}</p>}
            </div>
            <span className="text-sm text-fg-subtle transition-colors group-hover:text-accent">
              {d.count} {d.count === 1 ? "API" : "APIs"} →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
