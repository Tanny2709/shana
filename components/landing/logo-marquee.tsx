import type { CSSProperties } from "react";

// No real logo image assets exist for seeded providers (logoUrl is null
// across the board — see prisma/seed.ts), and fabricating logo images would
// misrepresent providers who never supplied one. This renders a wordmark
// marquee instead: real provider names, styled distinctly, communicating
// scale honestly without inventing image assets.
//
// Pure CSS, no client JS (a plain server component) — the list is
// duplicated once so the animate-marquee translateX(-50%) loop reads as
// seamless infinite scroll. Dimmed by default for the scrolling read; each
// wordmark sharpens to a full-saturation color from the landing palette on
// individual hover, via a per-item CSS variable + Tailwind's arbitrary
// hover selector (no event handlers needed).
const HOVER_COLORS = [
  "var(--landing-blue)",
  "var(--landing-violet)",
  "var(--landing-magenta)",
  "var(--landing-amber)",
  "var(--landing-coral)",
];

export function LogoMarquee({ names }: { names: string[] }) {
  if (names.length === 0) return null;
  const track = [...names, ...names];

  return (
    <div className="overflow-hidden border-y border-border py-6">
      <div className="flex w-max gap-12 animate-marquee">
        {track.map((name, i) => (
          <span
            key={`${name}-${i}`}
            style={{ "--hover-color": HOVER_COLORS[i % HOVER_COLORS.length] } as CSSProperties}
            className="shrink-0 text-lg font-semibold tracking-tight text-fg-subtle opacity-60 transition-[opacity,color] duration-150 ease-out hover:text-[var(--hover-color)] hover:opacity-100"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
