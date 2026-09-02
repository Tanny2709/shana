import { SCORE_MAX, type DirectoryScore } from "@/lib/scoring";
import { ScoreBadge } from "@/components/score-badge";

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
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-fg">Directory Score</h2>
        <ScoreBadge overall={score.overall} size="lg" />
      </div>
      <p className="mt-1 text-xs text-fg-subtle">
        Based on documentation, pricing, developer experience, and available API data — not a
        crowd-sourced rating or an industry ranking.
      </p>

      <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
        {ROWS.map((row) => (
          <div key={row.key} className="flex items-center justify-between text-sm">
            <span className="text-fg-muted">{row.label}</span>
            <span className="font-mono text-fg-subtle">
              {score.breakdown[row.key]}/{SCORE_MAX[row.key]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
