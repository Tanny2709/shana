import { SCORE_MAX, type DirectoryScore } from "@/lib/scoring";
import { ScoreRing } from "@/components/score-ring";

const ROWS: { key: keyof DirectoryScore["breakdown"]; label: string }[] = [
  { key: "documentation", label: "Documentation" },
  { key: "pricing", label: "Pricing" },
  { key: "developerExperience", label: "Developer Experience" },
  { key: "freeTier", label: "Free Tier" },
  { key: "maturity", label: "Maturity" },
  { key: "community", label: "Community" },
];

export function ScoreBreakdown({ score }: { score: DirectoryScore }) {
  return (
    <div className="rounded-lg border border-border bg-bg-elevated p-5">
      <div className="flex items-center gap-4">
        <ScoreRing overall={score.overall} />
        <div>
          <h2 className="text-sm font-medium text-fg">Directory Score</h2>
          <p className="mt-1 text-xs text-fg-subtle">
            Computed from documentation, pricing, developer experience, and available API data — not
            a crowd-sourced rating or industry ranking.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4">
        {ROWS.map((row) => {
          const value = score.breakdown[row.key];
          const max = SCORE_MAX[row.key];
          const pct = Math.round((value / max) * 100);
          return (
            <div key={row.key}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-fg-muted">{row.label}</span>
                <span className="font-mono text-fg-subtle">
                  {value}/{max}
                </span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-bg-hover">
                <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
