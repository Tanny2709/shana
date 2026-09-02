import type { DataConfidence as DataConfidenceType } from "@/lib/freshness";
import { timeAgo } from "@/lib/format";

const LEVEL_COLOR: Record<DataConfidenceType["level"], string> = {
  High: "text-success",
  Medium: "text-warning",
  Low: "text-fg-subtle",
};

export function DataConfidence({
  confidence,
  lastVerifiedAt,
}: {
  confidence: DataConfidenceType;
  lastVerifiedAt: Date;
}) {
  return (
    <div className="rounded-lg border border-border bg-bg-elevated p-4">
      <h3 className="mb-1 text-xs font-medium uppercase tracking-wide text-fg-subtle">Data confidence</h3>
      <p className={`text-sm font-medium ${LEVEL_COLOR[confidence.level]}`}>{confidence.level}</p>

      <ul className="mt-3 flex flex-col gap-1.5">
        {confidence.checks.map((c) => (
          <li key={c.label} className="flex items-center gap-2 text-xs text-fg-muted">
            <span className={c.ok ? "text-success" : "text-fg-subtle"}>{c.ok ? "✓" : "✕"}</span>
            {c.label}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-fg-subtle">Last verified: {timeAgo(lastVerifiedAt)}</p>
    </div>
  );
}
