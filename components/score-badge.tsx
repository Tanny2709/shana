function scoreColor(overall: number): string {
  if (overall >= 80) return "text-success";
  if (overall >= 60) return "text-fg";
  return "text-fg-muted";
}

export function ScoreBadge({ overall, size = "sm" }: { overall: number; size?: "sm" | "lg" }) {
  if (size === "lg") {
    return (
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-semibold tracking-tight ${scoreColor(overall)}`}>{overall}</span>
        <span className="text-sm text-fg-subtle">/100</span>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${scoreColor(overall)}`} title="Directory Score — see methodology on the detail page">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2 9.5 8.5 2 9.3l5.7 4.9L6 21l6-3.9 6 3.9-1.7-6.8L22 9.3l-7.5-.8Z" />
      </svg>
      {overall}
    </span>
  );
}
