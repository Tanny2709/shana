import Image from "next/image";

export function ProviderMark({
  name,
  logoUrl,
  size = 32,
}: {
  name: string;
  logoUrl?: string | null;
  size?: number;
}) {
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt={`${name} logo`}
        width={size}
        height={size}
        className="shrink-0 rounded-md border border-border object-contain bg-bg"
        style={{ width: size, height: size }}
      />
    );
  }

  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-md border border-border bg-bg text-sm font-medium text-fg-muted"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {initial}
    </div>
  );
}
