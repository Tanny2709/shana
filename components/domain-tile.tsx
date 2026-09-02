import Link from "next/link";
import { BookmarkButton } from "@/components/bookmark-button";

export function DomainTile({
  id,
  name,
  slug,
  count,
}: {
  id: string;
  name: string;
  slug: string;
  count: number;
}) {
  return (
    <Link
      href={`/domain/${slug}`}
      className="group flex flex-col justify-between gap-6 rounded-lg border border-border bg-bg-elevated p-5 transition-colors hover:border-border-strong"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-fg">{name}</span>
        <BookmarkButton type="domain" targetId={id} label={name} size={16} />
      </div>
      <span className="text-xs text-fg-subtle">
        {count} {count === 1 ? "API" : "APIs"}
      </span>
    </Link>
  );
}
