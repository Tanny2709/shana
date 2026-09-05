function tierColor(overall: number): string {
  if (overall >= 80) return "var(--success)";
  if (overall >= 60) return "var(--accent)";
  return "var(--fg-subtle)";
}

export function ScoreRing({ overall, size = 96 }: { overall: number; size?: number }) {
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(overall, 100)) / 100;
  const color = tierColor(overall);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference * progress} ${circumference}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold tracking-tight text-fg">{overall}</span>
        <span className="text-[10px] text-fg-subtle">/ 100</span>
      </div>
    </div>
  );
}
