// Landing-page-only domain color coding (Phase 7). Maps a domain slug to
// the CSS custom property holding its hue (defined in app/globals.css).
// Never imported by app pages — those keep the single restrained --accent.

const DOMAIN_COLOR_VAR: Record<string, string> = {
  "ai-ml": "--domain-ai-ml",
  payments: "--domain-payments",
  "maps-geolocation": "--domain-maps-geolocation",
  communication: "--domain-communication",
};

const FALLBACK_VAR = "--landing-blue";

export function getDomainColorVar(slug: string): string {
  return `var(${DOMAIN_COLOR_VAR[slug] ?? FALLBACK_VAR})`;
}
