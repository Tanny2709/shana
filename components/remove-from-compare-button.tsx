"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCompare } from "@/lib/compare-context";

export function RemoveFromCompareButton({ slug }: { slug: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { remove } = useCompare();

  function onRemove() {
    remove(slug);
    const ids = (searchParams.get("ids") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && s !== slug);

    if (ids.length === 0) {
      router.push("/compare");
    } else {
      router.push(`/compare?ids=${ids.join(",")}`);
    }
  }

  return (
    <button
      type="button"
      onClick={onRemove}
      className="text-xs text-fg-subtle hover:text-fg"
    >
      Remove
    </button>
  );
}
