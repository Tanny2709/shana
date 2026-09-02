import Link from "next/link";
import type { ReactNode } from "react";
import { ApiCard } from "@/components/api-card";
import type { ListingCard } from "@/lib/data";

export function DiscoveryRow({
  icon,
  title,
  listings,
  viewAllHref,
}: {
  icon: ReactNode;
  title: string;
  listings: ListingCard[];
  viewAllHref: string;
}) {
  if (listings.length === 0) return null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-medium text-fg">
          <span aria-hidden>{icon}</span>
          {title}
        </h2>
        <Link href={viewAllHref} className="text-xs text-accent hover:underline">
          View all →
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {listings.map((listing) => (
          <div key={listing.id} className="w-72 shrink-0">
            <ApiCard listing={listing} />
          </div>
        ))}
      </div>
    </div>
  );
}
