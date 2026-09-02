const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDateTime(date: Date): string {
  return `${dateTimeFormatter.format(date)} UTC`;
}

export function daysSince(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

const PRICING_LABELS: Record<string, string> = {
  free: "Free",
  freemium: "Freemium",
  pay_as_you_go: "Pay as you go",
  subscription: "Subscription",
  credit_based: "Credit-based",
};

export function pricingModelLabel(model: string): string {
  return PRICING_LABELS[model] ?? model;
}

const AUTH_LABELS: Record<string, string> = {
  api_key: "API key",
  oauth: "OAuth",
  both: "API key or OAuth",
  none: "None",
};

export function authMethodLabel(method: string): string {
  return AUTH_LABELS[method] ?? method;
}
